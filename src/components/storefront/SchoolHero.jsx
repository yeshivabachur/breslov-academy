import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SchoolHero({ school, user, slug }) {
  if (!school) return null;

  return (
    <div 
      className="relative bg-slate-900 text-white py-32 px-4 overflow-hidden"
    >
      {/* Background Image with Overlay */}
      {school.hero_image_url && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${school.hero_image_url})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/75 to-slate-900 z-10" />
        </>
      )}

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto text-center">
        {school.logo_url && (
          <div className="mb-8">
            <img 
              src={school.logo_url} 
              alt={school.name} 
              className="w-24 h-24 mx-auto rounded-xl shadow-2xl border-4 border-white/10" 
            />
          </div>
        )}
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
          {school.name}
        </h1>
        
        {school.tagline && (
          <p className="text-2xl md:text-3xl text-slate-300 mb-8 font-light leading-relaxed">
            {school.tagline}
          </p>
        )}
        
        {school.description && (
          <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            {school.description}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to={createPageUrl(`SchoolCourses?slug=${slug}`)}>
            <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
              Browse Courses
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          
          {!user && (
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg border-white/20 bg-white/5 hover:bg-white/10 text-white hover:text-white backdrop-blur-sm"
              asChild
            >
              <Link to={`/login/student?schoolSlug=${encodeURIComponent(slug || '')}`}>
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
