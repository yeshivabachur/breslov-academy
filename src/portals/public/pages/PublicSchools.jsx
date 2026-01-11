import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { Building2, ArrowRight, Search } from 'lucide-react';
import { tokens, cx } from '@/components/theme/tokens';

const SCHOOL_FIELDS = [
  'id',
  'name',
  'slug',
  'description',
  'tagline',
  'logo_url',
  'brand_primary',
  'status',
  'is_public'
];

export default function PublicSchools() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: schools = [], isLoading } = useQuery({
    queryKey: ['public-school-directory'],
    queryFn: async () => {
      try {
        const results = await base44.entities.School.filter({ is_public: true }, 'name', 200, { fields: SCHOOL_FIELDS });
        return results || [];
      } catch (error) {
        return [];
      }
    },
    staleTime: 300_000
  });

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleSchools = useMemo(() => {
    return schools.filter((school) => {
      const isVisible = school?.is_public !== false && school?.status !== 'inactive';
      if (!isVisible) return false;
      if (!normalizedQuery) return true;
      const name = String(school?.name || '').toLowerCase();
      const slug = String(school?.slug || '').toLowerCase();
      const description = String(school?.description || school?.tagline || '').toLowerCase();
      return name.includes(normalizedQuery) || slug.includes(normalizedQuery) || description.includes(normalizedQuery);
    });
  }, [schools, normalizedQuery]);

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-muted/30 py-16">
        <div className={cx(tokens.page.inner, 'space-y-6')}>
          <SectionHeader
            title="School Directory"
            description="Explore verified schools and enter their storefronts securely."
          />
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search schools by name, slug, or description"
              className="h-12 pl-10"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {isLoading ? 'Loading schools...' : `${visibleSchools.length} schools available`}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className={cx(tokens.page.inner, 'space-y-6')}>
          {visibleSchools.length === 0 && !isLoading ? (
            <GlassCard className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No schools match your search yet.</p>
            </GlassCard>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleSchools.map((school) => (
                <GlassCard key={school.id} className="flex h-full flex-col p-6" hover>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {school.logo_url ? (
                        <img src={school.logo_url} alt={school.name} className="h-12 w-12 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Building2 className="h-6 w-6" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-semibold text-foreground">{school.name}</h3>
                        <p className="text-xs text-muted-foreground">/{school.slug}</p>
                      </div>
                    </div>
                    <Badge variant="outline">Public</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {school.description || school.tagline || 'No description provided yet.'}
                  </p>
                  <div className="mt-auto pt-6">
                    <Button asChild className="w-full">
                      <Link to={`/s/${school.slug}`}>
                        Visit storefront
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
