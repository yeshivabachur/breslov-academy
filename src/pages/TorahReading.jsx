import React from 'react';
import PageShell from '@/components/ui/PageShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollText } from 'lucide-react';

export default function TorahReading() {
  return (
    <PageShell title="Torah Portion" subtitle="Weekly Parsha reading (Shnayim Mikra)">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="h-5 w-5" />
              Parshat Hashavua
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Bereshit</h2>
            <div className="font-serif text-lg leading-relaxed text-right" dir="rtl">
              בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃
            </div>
            <div className="mt-4 text-lg leading-relaxed">
              In the beginning God created the heaven and the earth.
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
