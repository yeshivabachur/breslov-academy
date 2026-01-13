import { addDays, differenceInDays, format, startOfDay } from 'date-fns';

// --- DAF YOMI CALCULATOR ---
// Cycle 14 started on Jan 5, 2020. Cycle length is approx 2711 days.
const DAF_CYCLE_START = new Date(2020, 0, 5); // Jan 5, 2020
const MASECHTOT = [
  { name: 'Berakhot', pages: 64 }, { name: 'Shabbat', pages: 157 }, { name: 'Eruvin', pages: 105 },
  { name: 'Pesachim', pages: 121 }, { name: 'Shekalim', pages: 22 }, { name: 'Yoma', pages: 88 },
  { name: 'Sukkah', pages: 56 }, { name: 'Beitzah', pages: 40 }, { name: 'Rosh Hashanah', pages: 35 },
  { name: 'Taanit', pages: 31 }, { name: 'Megillah', pages: 32 }, { name: 'Moed Katan', pages: 29 },
  { name: 'Chagigah', pages: 27 }, { name: 'Yevamot', pages: 122 }, { name: 'Ketubot', pages: 112 },
  { name: 'Nedarim', pages: 91 }, { name: 'Nazir', pages: 66 }, { name: 'Sotah', pages: 49 },
  { name: 'Gittin', pages: 90 }, { name: 'Kiddushin', pages: 82 }, { name: 'Bava Kamma', pages: 119 },
  { name: 'Bava Metzia', pages: 119 }, { name: 'Bava Batra', pages: 176 }, { name: 'Sanhedrin', pages: 113 },
  { name: 'Makkot', pages: 24 }, { name: 'Shevuot', pages: 49 }, { name: 'Avodah Zarah', pages: 76 },
  { name: 'Horayot', pages: 14 }, { name: 'Zevachim', pages: 120 }, { name: 'Menachot', pages: 110 },
  { name: 'Chullin', pages: 142 }, { name: 'Bekhorot', pages: 61 }, { name: 'Arakhin', pages: 34 },
  { name: 'Temurah', pages: 34 }, { name: 'Keritot', pages: 28 }, { name: 'Meilah', pages: 22 },
  { name: 'Tamid', pages: 33 }, { name: 'Middot', pages: 37 }, { name: 'Kinnim', pages: 26 },
  { name: 'Niddah', pages: 73 }
];

export function getDafYomi(date = new Date()) {
  const daysSinceStart = differenceInDays(startOfDay(date), startOfDay(DAF_CYCLE_START));
  let remainingPages = daysSinceStart;
  
  // Simple iteration to find current masechet
  for (const masechet of MASECHTOT) {
    if (remainingPages < masechet.pages) {
      return {
        masechet: masechet.name,
        daf: remainingPages + 2 // Pages start at 2
      };
    }
    remainingPages -= masechet.pages;
  }
  return { masechet: 'Cycle Complete', daf: 0 };
}

// --- ZMANIM CALCULATOR (Approximation) ---
// Simplified algorithm for UI demo purposes. 
// In production, integrate with 'kosher-zmanim' or similar library.

export function getZmanim(date = new Date(), lat = 31.7683, lng = 35.2137) { // Defaults to Jerusalem
  // Placeholder logic for visual prototype
  // Real calculation requires complex astronomical math
  const sunriseBase = 6 * 60 + 30; // 6:30 AM in minutes
  const sunsetBase = 18 * 60 + 15; // 6:15 PM in minutes
  
  const dayOfYear = Math.floor(differenceInDays(date, new Date(date.getFullYear(), 0, 0)));
  const seasonalOffset = -Math.sin((dayOfYear / 365) * Math.PI * 2) * 60; // +/- 60 mins

  const sunrise = sunriseBase + seasonalOffset;
  const sunset = sunsetBase - seasonalOffset;
  const chatzot = (sunrise + sunset) / 2;
  const plag = sunset - 75; // 1.25 hours before sunset

  const minsToTime = (totalMins) => {
    const h = Math.floor(totalMins / 60);
    const m = Math.floor(totalMins % 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  return {
    sunrise: minsToTime(sunrise),
    chatzot: minsToTime(chatzot),
    plagHaMincha: minsToTime(plag),
    sunset: minsToTime(sunset),
    candleLighting: minsToTime(sunset - 18) // 18 mins before sunset
  };
}
