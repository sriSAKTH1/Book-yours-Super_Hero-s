
// src/lib/dashboard/dashboardTypes.ts

// All dashboard collection counts

export interface DashboardStats {
  users: number
  media: number
  pages: number
  forms: number
  formSubmissions: number
  searchResults: number
  services: number
  superheroes: number
  posts: number
  contactInquiries: number
  consultationRequests: number
  newsletterSubscribers: number
}


// Published and draft content summary
export interface ContentPerformanceSummary {
  published: number
  drafts: number
  archived: number
  total: number
  publishedPercentage: number
}

// Daily chart data
export interface ContentChartItem {
  date: string
  published: number
  drafts: number
}

// Chart date filter
export type DashboardDateRange = '7days' | '30days' | '90days'

// Recent activity item
export interface RecentActivityItem {
  id: string
  title: string
  description: string
  collection: string
  action: 'created' | 'updated' | 'published'
  timestamp: string
  href: string
}

// Quick action item
export interface QuickActionItem {
  title: string
  description: string
  href: string
  icon: string
}

// Dashboard loading state
export interface DashboardLoadingState {
  stats: boolean
  performance: boolean
  activity: boolean
}

// Complete dashboard data
export interface DashboardData {
  stats: DashboardStats
  performance: ContentPerformanceSummary
  chartData: ContentChartItem[]
  recentActivity: RecentActivityItem[]
}
