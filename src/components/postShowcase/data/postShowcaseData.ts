
import { LucideIcon } from 'lucide-react';

export interface ExamplePost {
  id: number;
  template: string;
  preview: string;
  author: string;
  location: string;
  views: string;
  reactions: string;
  timeAgo: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface TemplateColors {
  topBar: string;
  avatar: string;
  badge: string;
}

export const examplePosts: ExamplePost[] = [
  {
    id: 1,
    template: "Consultant",
    preview: "Ever wonder why 70% of digital transformations fail? After implementing AI solutions for Fortune 500s, I've identified the real culprit. It's not the technology - it's the people side that gets overlooked every single time.",
    author: "Sarah C.",
    location: "Marketing Director, NYC",
    views: "1.2k",
    reactions: "89",
    timeAgo: "2 hours ago",
    isNew: true,
    isFeatured: true
  },
  {
    id: 2,
    template: "Founder",
    preview: "We went from 0 to $1M ARR in 8 months. Here are the 3 brutal lessons that made the difference (and why most startups ignore them).",
    author: "Marcus R.",
    location: "Founder, Austin",
    views: "2.8k",
    reactions: "147",
    timeAgo: "4 hours ago"
  },
  {
    id: 3,
    template: "Sales",
    preview: "Last week, a client said 'This is exactly what we needed.' It wasn't luck. Here's my proven framework for consultative selling that closes 40% more deals.",
    author: "Jennifer W.",
    location: "Sales Leader, Chicago",
    views: "847",
    reactions: "52",
    timeAgo: "Yesterday"
  },
  {
    id: 4,
    template: "VC",
    preview: "I've reviewed 10,000+ pitches. The best founders all do this one thing differently. It's not what you think.",
    author: "David P.",
    location: "VC Partner, SF",
    views: "3.1k",
    reactions: "203",
    timeAgo: "12 min ago"
  },
  {
    id: 5,
    template: "HR",
    preview: "Question: What's the #1 reason top talent leaves? It's not salary. We reduced employee turnover by 40% with one simple change that costs nothing.",
    author: "Lisa T.",
    location: "HR Director, Boston",
    views: "1.6k",
    reactions: "94",
    timeAgo: "6 hours ago"
  },
  {
    id: 6,
    template: "Consultant",
    preview: "My biggest client just saved $2M annually. The solution was hiding in plain sight, but everyone missed it.",
    author: "Ahmed H.",
    location: "Consultant, London",
    views: "423",
    reactions: "31",
    timeAgo: "1 day ago"
  }
];

export const templateColors: Record<string, TemplateColors> = {
  "Consultant": {
    topBar: "from-blue-500 to-blue-600",
    avatar: "from-blue-500 to-blue-600",
    badge: "bg-blue-100 text-blue-700"
  },
  "Founder": {
    topBar: "from-purple-500 to-purple-600",
    avatar: "from-purple-500 to-purple-600",
    badge: "bg-purple-100 text-purple-700"
  },
  "Sales": {
    topBar: "from-green-500 to-green-600",
    avatar: "from-green-500 to-green-600",
    badge: "bg-green-100 text-green-700"
  },
  "VC": {
    topBar: "from-orange-500 to-orange-600",
    avatar: "from-orange-500 to-orange-600",
    badge: "bg-orange-100 text-orange-700"
  },
  "HR": {
    topBar: "from-pink-500 to-pink-600",
    avatar: "from-pink-500 to-pink-600",
    badge: "bg-pink-100 text-pink-700"
  }
};

export const activities = [
  "Jessica L. in Miami just created a Sales post",
  "Michael R. in Seattle just created a Founder post",
  "Amanda K. in Boston just created a Consultant post",
  "James P. in Austin just created a VC post",
  "Rachel M. in Denver just created an HR post"
];
