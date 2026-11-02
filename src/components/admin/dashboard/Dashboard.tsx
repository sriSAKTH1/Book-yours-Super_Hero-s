import { Suspense } from 'react'

import { getDashboardStats } from '@/lib/dashboard/getDashboardStats'
import { getContentPerformance } from '@/lib/dashboard/getContentPerformance'
import { getRecentActivity } from '@/lib/dashboard/getRecentActivity'

import DashboardSkeleton from './DashboardSkeleton'
import WelcomeHeader from './WelcomeHeader'
import StatsGrid from './StatsGrid'
import ContentChartClient from './ContentChartClient'
import QuickActions from './QuickActions'
import RecentActivity from './RecentActivity'
import CollectionExplorer from './CollectionExplorer'
import SiteSettings from './SiteSettings'

const DashboardContent = async () => {
  const [stats, performance, recentActivity] = await Promise.all([
    getDashboardStats(),
    getContentPerformance('7days'),
    getRecentActivity(),
  ])

  return (
    <main className="dashboard-container">
      <WelcomeHeader />

      <section className="dashboard-overview-section">
        <StatsGrid stats={stats} />
      </section>

      <section className="dashboard-performance-section">
        <ContentChartClient
          initialData={performance.chartData}
          initialSummary={performance.summary}
        />
        <QuickActions />
      </section>

      <section className="dashboard-bottom-section">
        <CollectionExplorer />
        <RecentActivity activities={recentActivity} />
        <SiteSettings />
      </section>
    </main>
  )
}

export const Dashboard = () => {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}
