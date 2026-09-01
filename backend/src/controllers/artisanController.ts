import { Request, Response } from 'express';
import { ArtisanProfile } from '../types/index.js';

const MASTER_ARTISANS: ArtisanProfile[] = [
  {
    id: 'artisan-1',
    name: 'Ramnarayan Kumhar',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    village: 'Kot Jewar, Jaipur',
    state: 'Rajasthan',
    craftSpecialty: 'Blue Pottery & Glaze Art',
    experienceYears: 32,
    bio: {
      en: '4th generation master potter carrying forward Rajasthan’s GI-certified blue pottery craft.',
      hi: 'राजस्थान की जीआई-प्रमाणित ब्लू पॉटरी कला को आगे बढ़ाने वाले चौथी पीढ़ी के मास्टर कुम्हार।'
    },
    verified: true,
    giCertifiedArtisan: true,
    nationalAwardee: true,
    totalProductsSold: 428,
    rating: 4.9,
    storyQuote: 'Every stroke of cobalt is a prayer to preservation of our royal Rajasthani heritage.'
  }
];

export const getArtisans = (req: Request, res: Response): void => {
  res.json({ success: true, data: MASTER_ARTISANS });
};

export const getArtisanAnalytics = (req: Request, res: Response): void => {
  const { id } = req.params;
  const artisan = MASTER_ARTISANS.find((a) => a.id === id) || MASTER_ARTISANS[0];

  res.json({
    success: true,
    data: {
      artisanId: artisan.id,
      totalSalesRevenue: 142800,
      totalDispatches: artisan.totalProductsSold,
      directTipsEarned: 14600,
      masterRating: artisan.rating,
      aiDemandInsights: [
        {
          season: 'Diwali & Autumn Mela',
          demandIncrease: '+62%',
          recommendedItems: ['Terracotta Hand-Painted Diyas', 'Jaipur Blue Glaze Planters'],
          suggestedBatchSize: 40
        },
        {
          season: 'Wedding Season',
          demandIncrease: '+45%',
          recommendedItems: ['Banarasi Silk Brocade Shawls', 'Bastar Dhokra Elephant Centerpieces'],
          suggestedBatchSize: 25
        }
      ]
    }
  });
};
