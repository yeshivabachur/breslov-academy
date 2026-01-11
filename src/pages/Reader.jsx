import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookMarked, Search, Highlighter, FileText, Lock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import ProtectedContent from '@/components/protection/ProtectedContent';
import AccessGate from '@/components/security/AccessGate';
import AiTutorPanel from '@/components/ai/AiTutorPanel';
import { buildCacheKey, scopedCreate, scopedFilter } from '@/components/api/scoped';
import { useSession } from '@/components/hooks/useSession';

export default function Reader() {
  const { user, activeSchoolId, activeSchool, isLoading } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedText, setSelectedText] = useState(null);
  const queryClient = useQueryClient();

  const { data: entitlements = [] } = useQuery({
    queryKey: ['entitlements', user?.email, activeSchoolId],
    queryFn: () => scopedFilter('Entitlement', activeSchoolId, {
      user_email: user.email
    }),
    enabled: !!user && !!activeSchoolId
  });

  const { data: policy } = useQuery({
    queryKey: ['protection-policy', activeSchoolId],
    queryFn: async () => {
      const policies = await scopedFilter('ContentProtectionPolicy', activeSchoolId, {});
      return policies[0] || {
        protect_content: true,
        allow_previews: true,
        max_preview_chars: 1500,
        block_copy: true,
        copy_mode: 'ADDON',
        download_mode: 'ADDON'
      };
    },
    enabled: !!activeSchoolId
  });

  const effectivePolicy = policy || {
    protect_content: true,
    allow_previews: false,
    max_preview_chars: 1500,
    block_copy: true,
    copy_mode: 'ADDON',
    download_mode: 'ADDON'
  };

  const allowPreviews = !!effectivePolicy.allow_previews;

  const textListFields = useMemo(() => ([
    'id',
    'text_id',
    'title',
    'title_hebrew',
    'source',
    'source_ref',
    'course_id',
    'is_preview',
  ]), []);

  const { data: texts = [] } = useQuery({
    queryKey: buildCacheKey('texts', activeSchoolId, user?.email, entitlements.length, allowPreviews),
    queryFn: async () => {
      // SECURITY: Do NOT fetch protected text bodies for unentitled users.
      // Without server-side field projection, we gate at query-time.
      const hasAllCourses = entitlements.some(e => {
        const type = e.entitlement_type || e.type;
        return type === 'ALL_COURSES';
      });

      if (hasAllCourses) {
        return scopedFilter('Text', activeSchoolId, {}, '-created_date', 50, { fields: textListFields });
      }

      const allowedCourseIds = entitlements
        .filter(e => {
          const type = e.entitlement_type || e.type;
          return type === 'COURSE' && e.course_id;
        })
        .map(e => e.course_id);

      const filter = {
        // public texts (no course) OR preview texts OR texts in entitled courses
        $or: [
          { course_id: null },
          { course_id: '' },
          ...(allowPreviews ? [{ is_preview: true }] : []),
          ...(allowedCourseIds.length ? [{ course_id: { $in: allowedCourseIds } }] : [])
        ]
      };
      return scopedFilter('Text', activeSchoolId, filter, '-created_date', 50, { fields: textListFields });
    },
    enabled: !!activeSchoolId && !!user
  });

  const { data: highlights = [] } = useQuery({
    queryKey: ['highlights', user?.email, activeSchoolId],
    queryFn: () => scopedFilter('Highlight', activeSchoolId, {
      user_email: user.email
    }),
    enabled: !!user && !!activeSchoolId
  });

  const highlightMutation = useMutation({
    mutationFn: (data) => scopedCreate('Highlight', activeSchoolId, {
      user_email: user.email,
      ...data
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['highlights']);
    }
  });

  // Pure helper (not hook) to compute access
  const computeTextAccess = (text) => {
    if (!text.course_id) {
      // Public text - allow viewing but respect copy/download policy
      return {
        accessLevel: 'FULL',
        canCopy: effectivePolicy.copy_mode !== 'DISALLOW',
        canDownload: effectivePolicy.download_mode !== 'DISALLOW',
        maxPreviewChars: effectivePolicy.max_preview_chars || 1500
      };
    }
    
    // Text tied to course - check entitlements
    const hasCourseAccess = entitlements.some(e => {
      const type = e.entitlement_type || e.type;
      return (type === 'COURSE' && e.course_id === text.course_id) || type === 'ALL_COURSES';
    });

    const hasCopyLicense = entitlements.some(e => {
      const type = e.entitlement_type || e.type;
      return type === 'COPY_LICENSE';
    });

    const hasDownloadLicense = entitlements.some(e => {
      const type = e.entitlement_type || e.type;
      return type === 'DOWNLOAD_LICENSE';
    });

    const previewAllowed = effectivePolicy.allow_previews && text.is_preview;
    const accessLevel = hasCourseAccess ? 'FULL' : (previewAllowed ? 'PREVIEW' : 'LOCKED');
    
    const canCopy = effectivePolicy.copy_mode === 'INCLUDED_WITH_ACCESS' 
      ? hasCourseAccess 
      : effectivePolicy.copy_mode === 'ADDON' 
      ? (hasCourseAccess && hasCopyLicense)
      : false;

    const canDownload = effectivePolicy.download_mode === 'INCLUDED_WITH_ACCESS' 
      ? hasCourseAccess 
      : effectivePolicy.download_mode === 'ADDON' 
      ? (hasCourseAccess && hasDownloadLicense)
      : false;

    return { accessLevel, canCopy, canDownload, maxPreviewChars: effectivePolicy.max_preview_chars || 1500 };
  };

  const filteredTexts = searchQuery
    ? texts.filter(t => 
        t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.source?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : texts;

  const selectedAccess = useMemo(() => {
    if (!selectedText) return null;
    return computeTextAccess(selectedText);
  }, [selectedText, entitlements, effectivePolicy]);

  const textContentFields = useMemo(() => ([
    'id',
    'text_id',
    'title',
    'title_hebrew',
    'source',
    'source_ref',
    'course_id',
    'content',
  ]), []);

  const { data: selectedTextFull = null } = useQuery({
    queryKey: buildCacheKey('text', activeSchoolId, selectedText?.id, selectedAccess?.accessLevel),
    queryFn: async () => {
      if (!selectedText?.id) return null;
      const previewChars = selectedAccess?.accessLevel === 'PREVIEW'
        ? (selectedAccess?.maxPreviewChars || effectivePolicy.max_preview_chars || 1500)
        : null;
      const rows = await scopedFilter(
        'Text',
        activeSchoolId,
        { id: selectedText.id },
        null,
        1,
        { fields: textContentFields, previewChars }
      );
      return rows?.[0] || null;
    },
    enabled: !!activeSchoolId && !!selectedText?.id && selectedAccess?.accessLevel !== 'LOCKED',
  });

  if (isLoading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <BookMarked className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold">Smart Reader</h1>
        </div>
        <p className="text-slate-600 mb-6">
          Read, highlight, and study sacred texts with AI-powered insights
        </p>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search texts..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Text Library */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Text Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredTexts.map((text) => {
                  const access = computeTextAccess(text);
                  const isLocked = access.accessLevel === 'LOCKED';
                  
                  return (
                    <button
                      key={text.id}
                      onClick={() => !isLocked && setSelectedText(text)}
                      disabled={isLocked}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedText?.id === text.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{text.title}</div>
                          {text.title_hebrew && (
                            <div className="text-xs text-amber-700 mt-1" dir="rtl">
                              {text.title_hebrew}
                            </div>
                          )}
                        </div>
                        {isLocked && <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                      </div>
                      {text.source && (
                        <div className="text-xs text-slate-500 mt-1">{text.source}</div>
                      )}
                    </button>
                  );
                })}
                
                {filteredTexts.length === 0 && (
                  <p className="text-slate-500 text-sm text-center py-8">
                    No texts found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reader View */}
        <div className="lg:col-span-2">
          {selectedText ? (
            (() => {
              const access = selectedAccess || computeTextAccess(selectedText);
              
              if (access.accessLevel === 'LOCKED') {
                return (
                  <AccessGate
                    courseId={selectedText.course_id}
                    schoolSlug={activeSchool?.slug}
                    message="This text is only available to enrolled students"
                  />
                );
              }

              const fullContent = selectedTextFull?.content || '';
              const contentToShow = access.accessLevel === 'PREVIEW'
                ? fullContent
                : fullContent;

              return (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{selectedTextFull?.title || selectedText.title}</CardTitle>
                          {(selectedTextFull?.title_hebrew || selectedText.title_hebrew) && (
                            <p className="text-amber-700 mt-2" dir="rtl">{selectedTextFull?.title_hebrew || selectedText.title_hebrew}</p>
                          )}
                        </div>
                        {access.accessLevel === 'PREVIEW' && (
                          <Badge className="bg-amber-500">Preview</Badge>
                        )}
                      </div>
                      {(selectedTextFull?.source || selectedText.source) && (
                        <p className="text-sm text-slate-600 mt-2">{selectedTextFull?.source || selectedText.source}</p>
                      )}
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ProtectedContent
                        policy={effectivePolicy}
                        userEmail={user?.email}
                        schoolName={activeSchool?.name}
                        canCopy={access.canCopy}
                        canDownload={access.canDownload}
                      >
                        <Tabs defaultValue="text">
                          <TabsList>
                            <TabsTrigger value="text">
                              <FileText className="w-4 h-4 mr-2" />
                              Text
                            </TabsTrigger>
                            <TabsTrigger value="highlights">
                              <Highlighter className="w-4 h-4 mr-2" />
                              My Highlights
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="text" className="mt-6">
                            <div className="prose prose-slate max-w-none">
                              <ReactMarkdown>
                                {contentToShow || 'No content available'}
                              </ReactMarkdown>
                            </div>
                            
                              {access.accessLevel === 'PREVIEW' && (
                                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
                                  <p className="text-amber-800 mb-3">Preview limit reached</p>
                                  <Button className="bg-amber-500 hover:bg-amber-600">
                                    Purchase Full Access
                                  </Button>
                                </div>
                              )}
                          </TabsContent>

                          <TabsContent value="highlights" className="mt-6">
                            <div className="space-y-3">
                              {highlights
                                .filter(h => h.text_id === selectedText.id)
                                .map((highlight) => (
                                  <Card key={highlight.id} className="bg-amber-50">
                                    <CardContent className="p-4">
                                      <p className="text-sm italic mb-2">"{highlight.highlighted_text}"</p>
                                      {highlight.note && (
                                        <p className="text-xs text-slate-600">{highlight.note}</p>
                                      )}
                                    </CardContent>
                                  </Card>
                                ))}
                              
                              {highlights.filter(h => h.text_id === selectedText.id).length === 0 && (
                                <p className="text-slate-500 text-sm text-center py-8">
                                  No highlights yet. Select text to highlight.
                                </p>
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </ProtectedContent>
                    </CardContent>
                  </Card>

                  {/* AI Tutor */}
                  <AiTutorPanel
                    contextType="TEXT"
                    contextId={selectedText.id}
                    contextTitle={selectedText.title}
                    contextContent={contentToShow}
                    user={user}
                    schoolId={activeSchoolId}
                  />
                </div>
              );
            })()
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <BookMarked className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Select a text to begin reading</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
