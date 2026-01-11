import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from '@/components/hooks/useSession';
import { scopedCreate, scopedDelete, scopedFilter, scopedUpdate } from '@/components/api/scoped';
import SchoolAnalytics from '@/components/school/SchoolAnalytics';
import SchoolAnnouncements from '@/components/school/SchoolAnnouncements';
import SchoolModeration from '@/components/school/SchoolModeration';
import SchoolAuditLog from '@/components/school/SchoolAuditLog';
import SchoolPayouts from '@/components/school/SchoolPayouts';
import ContentProtectionSettings from '@/components/admin/ContentProtectionSettings';
import TerminologySettings from '@/components/school/TerminologySettings';
import SchoolAuthSettings from '@/components/school/SchoolAuthSettings';

export default function SchoolAdmin() {
  const [school, setSchool] = useState(null);
  const [originalSchool, setOriginalSchool] = useState(null);
  const [membership, setMembership] = useState(null);
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const { user, activeSchoolId, isLoading: isSessionLoading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSessionLoading) {
      loadSchoolData();
    }
  }, [isSessionLoading, activeSchoolId, user?.email]);

  const loadSchoolData = async () => {
    try {
      // Get active school
      if (!activeSchoolId) {
        navigate(createPageUrl('Dashboard'));
        return;
      }
      if (!user?.email) {
        base44.auth.redirectToLogin();
        return;
      }

      const schools = await base44.entities.School.filter({ id: activeSchoolId });
      if (schools.length === 0) {
        navigate(createPageUrl('Dashboard'));
        return;
      }
      setSchool(schools[0]);
      setOriginalSchool({ ...schools[0] });

      // Check permission
      const userMembership = await scopedFilter('SchoolMembership', activeSchoolId, {
        user_email: user.email
      });

      if (userMembership.length === 0) {
        navigate(createPageUrl('Dashboard'));
        return;
      }

      setMembership(userMembership[0]);

      if (userMembership[0].role !== 'OWNER' && userMembership[0].role !== 'ADMIN') {
        toast.error('You do not have permission to access this page');
        navigate(createPageUrl('Dashboard'));
        return;
      }

      // Load members and invites
      loadMembers(activeSchoolId);
      loadInvites(activeSchoolId);
    } catch (error) {
      base44.auth.redirectToLogin();
    }
  };

  const loadMembers = async (schoolId) => {
    const schoolMembers = await scopedFilter('SchoolMembership', schoolId, {});
    setMembers(schoolMembers);
  };

  const loadInvites = async (schoolId) => {
    const schoolInvites = await scopedFilter('SchoolInvite', schoolId, {});
    setInvites(schoolInvites);
  };

  const handleUpdateSchool = async (e) => {
    e.preventDefault();
    try {
      const previous = originalSchool || {};
      const changedFields = Object.keys(school || {}).filter((key) => school[key] !== previous[key]);
      const updatedSchool = await scopedUpdate('School', school.id, school);
      setSchool(updatedSchool);
      setOriginalSchool({ ...updatedSchool });

      if (activeSchoolId && user?.email) {
        try {
          await scopedCreate('AuditLog', activeSchoolId, {
            school_id: activeSchoolId,
            user_email: user.email,
            action: 'UPDATE_SCHOOL_BRANDING',
            entity_type: 'School',
            entity_id: school.id,
            metadata: { changed_fields: changedFields }
          });
        } catch (error) {
          // Best effort audit
        }
      }

      toast.success('School updated successfully');
    } catch (error) {
      toast.error('Failed to update school');
    }
  };

  const handleCreateInvite = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const role = formData.get('role');

    try {
      if (!activeSchoolId) {
        toast.error('No active school selected');
        return;
      }
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

      const invite = await scopedCreate('SchoolInvite', activeSchoolId, {
        school_id: activeSchoolId,
        email,
        role,
        invited_by_user: user.email,
        token,
        expires_at: expiresAt.toISOString()
      });

      const inviteUrl = `${window.location.origin}${createPageUrl('SchoolJoin')}?token=${token}`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(inviteUrl);
      toast.success('Invite created! Link copied to clipboard');

      try {
        await scopedCreate('AuditLog', activeSchoolId, {
          school_id: activeSchoolId,
          user_email: user.email,
          action: 'SCHOOL_INVITE_CREATED',
          entity_type: 'SchoolInvite',
          entity_id: invite?.id,
          metadata: { invited_email: email, role }
        });
      } catch (error) {
        // Best effort audit
      }
      
      loadInvites(school.id);
      e.target.reset();
    } catch (error) {
      toast.error('Failed to create invite');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    
    try {
      await scopedDelete('SchoolMembership', memberId, activeSchoolId, true);
      toast.success('Member removed');
      try {
        await scopedCreate('AuditLog', activeSchoolId, {
          school_id: activeSchoolId,
          user_email: user.email,
          action: 'SCHOOL_MEMBER_REMOVED',
          entity_type: 'SchoolMembership',
          entity_id: memberId
        });
      } catch (error) {
        // Best effort audit
      }
      loadMembers(activeSchoolId);
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  const copyInviteLink = (token) => {
    const inviteUrl = `${window.location.origin}${createPageUrl('SchoolJoin')}?token=${token}`;
    navigator.clipboard.writeText(inviteUrl);
    toast.success('Invite link copied!');
  };

  if (isSessionLoading || !school || !membership) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-3">
          <Building2 className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-bold text-white">School Administration</h1>
        </div>
        <p className="text-slate-300">Manage {school.name}</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-12">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="protection">Protection</TabsTrigger>
          <TabsTrigger value="terminology">Terms</TabsTrigger>
          <TabsTrigger value="auth">SSO</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>School Overview</CardTitle>
              <CardDescription>Key statistics and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Members</CardDescription>
                    <CardTitle className="text-3xl">{members.length}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Pending Invites</CardDescription>
                    <CardTitle className="text-3xl">{invites.filter(i => !i.accepted_at).length}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Your Role</CardDescription>
                    <CardTitle className="text-xl">{membership.role}</CardTitle>
                  </CardHeader>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>School Branding</CardTitle>
              <CardDescription>Customize your school's appearance</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateSchool} className="space-y-4">
                <div className="space-y-2">
                  <Label>School Name</Label>
                  <Input
                    value={school.name}
                    onChange={(e) => setSchool({ ...school, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL Slug</Label>
                  <Input
                    value={school.slug}
                    onChange={(e) => setSchool({ ...school, slug: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={school.description || ''}
                    onChange={(e) => setSchool({ ...school, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Logo URL</Label>
                  <Input
                    value={school.logo_url || ''}
                    onChange={(e) => setSchool({ ...school, logo_url: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <Input
                      type="color"
                      value={school.brand_primary || '#d4af37'}
                      onChange={(e) => setSchool({ ...school, brand_primary: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <Input
                      type="color"
                      value={school.brand_accent || '#1e40af'}
                      onChange={(e) => setSchool({ ...school, brand_accent: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="people">
          <Card>
            <CardHeader>
              <CardTitle>School Members</CardTitle>
              <CardDescription>Manage members and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{member.user_email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{member.role}</Badge>
                        {member.title_label && (
                          <Badge variant="secondary">{member.title_label}</Badge>
                        )}
                      </div>
                    </div>
                    {member.role !== 'OWNER' && membership.role === 'OWNER' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invites">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Invitation</CardTitle>
                <CardDescription>Invite new members to your school</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateInvite} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input name="email" type="email" required placeholder="student@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select name="role" defaultValue="STUDENT">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STUDENT">Student</SelectItem>
                        <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                        <SelectItem value="TA">Teaching Assistant</SelectItem>
                        <SelectItem value="MODERATOR">Moderator</SelectItem>
                        {membership.role === 'OWNER' && (
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit">Create Invite</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invites.filter(i => !i.accepted_at).map((invite) => (
                    <div key={invite.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{invite.email}</p>
                        <p className="text-sm text-slate-500">Role: {invite.role}</p>
                        <p className="text-xs text-slate-400">
                          Expires: {new Date(invite.expires_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyInviteLink(invite.token)}
                      >
                        <Copy className="w-3 h-3 mr-2" />
                        Copy Link
                      </Button>
                    </div>
                  ))}
                  {invites.filter(i => !i.accepted_at).length === 0 && (
                    <p className="text-slate-500 text-center py-8">No pending invitations</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <SchoolAnalytics />
        </TabsContent>

        <TabsContent value="payouts">
          <SchoolPayouts school={school} user={user} />
        </TabsContent>

        <TabsContent value="announcements">
          <SchoolAnnouncements school={school} user={user} />
        </TabsContent>

        <TabsContent value="moderation">
          <SchoolModeration school={school} user={user} membership={membership} />
        </TabsContent>

        <TabsContent value="audit">
          <SchoolAuditLog school={school} />
        </TabsContent>

        <TabsContent value="protection">
          <Card>
            <CardHeader>
              <CardTitle>Content Protection & Licensing</CardTitle>
              <CardDescription>
                Protect your content and monetize additional usage rights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentProtectionSettings schoolId={school.id} user={user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terminology">
          <TerminologySettings school={school} user={user} onSave={loadSchoolData} />
        </TabsContent>

        <TabsContent value="auth">
          <SchoolAuthSettings schoolId={school.id} />
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>School Settings</CardTitle>
                <CardDescription>Advanced configuration options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-600">Additional settings and billing will be available in future updates.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Protection</CardTitle>
                <CardDescription>Configure how your content is protected</CardDescription>
              </CardHeader>
              <CardContent>
                <ContentProtectionSettings schoolId={school.id} user={user} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
