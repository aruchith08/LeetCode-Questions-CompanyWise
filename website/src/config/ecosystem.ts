export interface EcosystemPlatform {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  isExternal: boolean;
  isCurrent?: boolean;
  logo: string;
  badge?: string;
  badgeType?: 'active' | 'brand' | 'accent';
  primaryColor?: string;
}

export const ECOSYSTEM_PLATFORMS: EcosystemPlatform[] = [
  {
    id: 'companywise',
    name: 'CompanyWise',
    tagline: 'Technical Interview Intelligence',
    description: '490+ Company Question Banks & Live LeetCode Sync',
    url: '/',
    isExternal: false,
    isCurrent: true,
    logo: '/favicon.svg',
    badge: 'Active Platform',
    badgeType: 'active',
    primaryColor: '#0F1B3D',
  },
  {
    id: 'learn-box',
    name: 'Learn Box',
    tagline: 'Visual Tech & Interactive Hub',
    description: 'Bite-sized visual lessons, engineering courses & interactive guides',
    url: 'https://learn-box.vercel.app',
    isExternal: true,
    logo: '/brands/learn-box.png',
    badge: 'Visit',
    badgeType: 'brand',
    primaryColor: '#E60000',
  },
  {
    id: 'abdulbari-dsa',
    name: 'Abdulbari DSA',
    tagline: 'ARH Learning System',
    description: 'In-depth Data Structures & Algorithms course mastery & problem solutions',
    url: 'https://abdulbari-arh.vercel.app',
    isExternal: true,
    logo: '/brands/abdulbari-dsa.png',
    badge: 'Visit',
    badgeType: 'accent',
    primaryColor: '#D97757',
  },
];
