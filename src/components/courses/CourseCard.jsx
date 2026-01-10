import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Crown, Sparkles, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { tokens, cx } from '@/components/theme/tokens';

export default function CourseCard({ course, userTier = 'free' }) {
  const tierIcons = {
    free: { icon: Sparkles, color: 'text-slate-500' },
    premium: { icon: Crown, color: 'text-primary' },
    elite: { icon: Crown, color: 'text-amber-500' }
  };

  const TierIcon = tierIcons[course.access_tier]?.icon || Sparkles;
  const tierColor = tierIcons[course.access_tier]?.color || 'text-slate-500';

  const hasAccess = 
    course.access_tier === 'free' ||
    (course.access_tier === 'premium' && ['premium', 'elite'].includes(userTier)) ||
    (course.access_tier === 'elite' && userTier === 'elite');

  const levelColors = {
    beginner: 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    intermediate: 'bg-amber-100/80 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    advanced: 'bg-rose-100/80 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
  };

  return (
    <Link to={createPageUrl(`CourseDetail?id=${course.id}`)} className="block h-full group">
      <Card className={cx(
        tokens.glass.card, 
        tokens.glass.cardHover,
        "h-full overflow-hidden border-none shadow-sm flex flex-col"
      )}>
        <div className="relative aspect-video overflow-hidden bg-muted">
          {course.thumbnail_url ? (
            <img 
              src={course.thumbnail_url} 
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
              <TierIcon className={cx("w-12 h-12 opacity-20", tierColor)} />
            </div>
          )}
          
          {!hasAccess && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex items-center justify-center">
              <div className="text-center p-4">
                <Crown className="w-10 h-10 text-primary mx-auto mb-2 opacity-80" />
                <p className="text-sm font-bold tracking-tight uppercase">
                  {course.access_tier} Access
                </p>
              </div>
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge variant="secondary" className={cx("border-none font-medium", levelColors[course.level])}>
              {course.level}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6 flex-1 flex flex-col">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <TierIcon className={cx("w-3.5 h-3.5", tierColor)} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {course.category || 'General'}
              </span>
            </div>

            <h3 className="font-bold text-xl leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {course.title}
            </h3>
            
            {course.title_hebrew && (
              <p className="text-primary font-medium mb-3 text-lg leading-relaxed" dir="rtl">
                {course.title_hebrew}
              </p>
            )}
            
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed mb-4">
              {course.description}
            </p>
          </div>

          <div className="pt-4 mt-auto border-t border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <User className="w-3.5 h-3.5 opacity-70" />
              <span>{course.instructor}</span>
            </div>
            
            {course.duration_hours && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md font-medium">
                <Clock className="w-3 h-3" />
                <span>{course.duration_hours}h</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}