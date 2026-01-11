import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useSession } from '@/components/hooks/useSession';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  ShieldCheck, 
  Users, 
  Zap, 
  ArrowRight,
  Globe,
  Lock,
  Star
} from 'lucide-react';
import { tokens, cx } from '@/components/theme/tokens';

export default function PublicHome() {
  const { user, isLoading } = useSession();

  // v9.1: Guests see marketing home; authenticated users go straight to the app portal.
  if (!isLoading && user) return <Navigate to="/app" replace />;

  return (
    <div className="flex flex-col">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_center] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 px-4 py-1 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
                <Star className="mr-2 h-3.5 w-3.5 fill-primary" />
                The Future of Torah Learning
              </Badge>
            </div>
            
            <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Torah learning, built like a <span className="text-primary">modern platform.</span>
            </h1>
            
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              A premium, multi-tenant learning management system designed for clarity, speed, and absolute content protection. 
              Empowering schools to teach Rebbe Nachman's light to the world.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="h-14 px-8 text-lg font-semibold shadow-lg shadow-primary/20" asChild>
                <Link to="/s/demo">
                  Browse Demo School <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <div className="flex gap-2">
                <Button size="lg" variant="outline" className="h-14 px-6 font-medium" asChild>
                  <Link to="/login/student">Student Login</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-6 font-medium" asChild>
                  <Link to="/login/teacher">Teacher Login</Link>
                </Button>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-8">
              {[
                { icon: Lock, label: "Protected Content" },
                { icon: Globe, label: "Multi-Tenant" },
                { icon: Zap, label: "Lightning Fast" },
                { icon: Users, label: "Community Driven" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                  <item.icon className="h-4 w-4 text-primary/60" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Built for real schools</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Each school has its own branding, policies, products, staff, and learners — while the platform remains unified and secure.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard 
              icon={ShieldCheck}
              title="Airtight Protection"
              description="Watermarking, preview limits, and strict download rules. Your premium content stays premium."
            />
            <FeatureCard 
              icon={BookOpen}
              title="Storefronts for All"
              description="Every school gets a unique storefront at /s/<slug> with its own catalog and checkout."
            />
            <FeatureCard 
              icon={Users}
              title="Role-Based Access"
              description="Dedicated portals for Students, Teachers, and Admins with tailored workflows for each."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground shadow-2xl sm:px-12 sm:py-24">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
            <h2 className="relative mb-6 text-3xl font-bold sm:text-5xl">Ready to share your light?</h2>
            <p className="relative mx-auto mb-10 max-w-2xl text-lg opacity-90 sm:text-xl">
              Join the Breslov Academy network today and start teaching Rebbe Nachman's wisdom with a modern, secure platform.
            </p>
            <Button size="lg" variant="secondary" className="relative h-14 px-10 text-lg font-bold shadow-xl" asChild>
              <Link to="/signup/school">Request School Onboarding</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="group rounded-2xl border border-border bg-background p-8 transition-all hover:border-primary/50 hover:shadow-xl">
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-3 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}