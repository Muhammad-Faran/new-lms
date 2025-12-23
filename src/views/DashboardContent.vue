<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Chart.js
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  Legend
)

/**
 * =========================
 * Chart State
 * =========================
 */
const chartRef = ref(null)
let chartInstance = null

// Dummy 12-month data (API-ready)
const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const loanApplications = [
  45, 60, 52, 78, 90, 110,
  95, 120, 130, 150, 170, 190
]

const buildChart = () => {
  if (!chartRef.value) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(chartRef.value, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Loan Applications',
          data: loanApplications,
          borderColor: '#34d399', // emerald-400
          backgroundColor: 'rgba(52, 211, 153, 0.15)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#34d399',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#e5e7eb',
            font: { size: 12 },
          },
        },
        tooltip: {
          backgroundColor: '#020617',
          titleColor: '#ffffff',
          bodyColor: '#e5e7eb',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 10,
        },
      },
      scales: {
        x: {
          ticks: { color: '#94a3b8' },
          grid: { display: false },
        },
        y: {
          ticks: { color: '#94a3b8' },
          grid: {
            color: 'rgba(148, 163, 184, 0.15)',
          },
        },
      },
    },
  })
}

onMounted(() => {
  buildChart()
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})

/**
 * =========================
 * Stats (Dummy for now)
 * Replace later from API
 * =========================
 */
const stats = ref([
  {
    title: 'Total Applications',
    value: '1,360',
    sub: 'All time',
    badge: '+8% MoM',
  },
  {
    title: 'Total Disbursed Amount',
    value: 'PKR 54.2M',
    sub: 'All time',
    badge: '+3.2% MoM',
  },
  {
    title: 'Total AUM (Disbursed Loans)',
    value: 'PKR 19.6M',
    sub: 'Currently active',
    badge: 'Stable',
  },
  {
    title: 'Total Applicants',
    value: '4,820',
    sub: 'Unique applicants',
    badge: '+120 this month',
  },
  {
    title: 'Active Applicants (3 Months)',
    value: '1,145',
    sub: 'Last 90 days',
    badge: '+4.6% MoM',
  },
])

const glowMap = [
  'shadow-emerald-500/15',
  'shadow-cyan-500/10',
  'shadow-indigo-500/10',
  'shadow-emerald-500/10',
  'shadow-cyan-500/10',
]
</script>

<template>
  <div class="px-6 py-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-slate-900">Dashboard</h1>
      <p class="text-sm text-slate-500">
        Overview of loan activity (dummy data for now)
      </p>
    </div>

    <!-- =========================
         Stats (Top)
    ========================== -->
    <div class="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div
        v-for="(s, idx) in stats"
        :key="s.title"
        class="group relative overflow-hidden rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-black p-5 shadow-xl shadow-black/40 transition-transform duration-200 hover:-translate-y-0.5"
        :class="glowMap[idx]">

        <!-- Accent strip -->
        <div
          class="absolute inset-y-4 left-0 w-[3px] rounded-full bg-emerald-400/80 group-hover:bg-emerald-300 transition-colors"></div>

        <!-- Soft glow blob -->
        <div
          class="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl"></div>

        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {{ s.title }}
            </p>
            <p class="mt-2 text-2xl font-semibold text-white">
              {{ s.value }}
            </p>
            <p class="mt-1 text-xs text-slate-400">
              {{ s.sub }}
            </p>
          </div>

          <span
            class="shrink-0 rounded-full border border-slate-700/70 bg-slate-900/60 px-2.5 py-1 text-[11px] font-semibold text-slate-200">
            {{ s.badge }}
          </span>
        </div>

        <!-- Bottom micro line -->
        <div class="mt-4 h-[2px] w-full rounded-full bg-slate-800/70">
          <div class="h-[2px] w-2/3 rounded-full bg-emerald-400/60"></div>
        </div>
      </div>
    </div>

    <!-- =========================
         Chart Card
    ========================== -->
    <div
      class="rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-black p-6 shadow-2xl shadow-black/40">

      <div class="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold text-white">
            Loan Applications – Last 12 Months
          </h2>
          <p class="text-xs text-slate-400">
            Monthly application count
          </p>
        </div>

        <span
          class="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1 text-xs text-slate-300">
          <span class="size-2 rounded-full bg-emerald-400"></span>
          Applications
        </span>
      </div>

      <div class="h-[320px]">
        <canvas ref="chartRef"></canvas>
      </div>
    </div>
  </div>
</template>
