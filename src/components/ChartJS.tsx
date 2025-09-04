"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type ChartProps = {
  id: string;
  dataUrl: string;
  type: 'line' | 'bar';
  title: string;
  description?: string;
};

export default function ChartComponent({ id, dataUrl, type, title, description }: ChartProps) {
  const [chartData, setChartData] = useState<ChartData<'line' | 'bar', number[], string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(dataUrl);
        const text = await response.text();
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',');
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          const row: Record<string, string> = {};
          headers.forEach((header, index) => {
            row[header] = values[index];
          });
          return row;
        });

        if (id === 'monthly-trends-line') {
          // Line chart for monthly trends
          setChartData({
            labels: data.map(d => {
              const date = new Date(d.month);
              return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            }),
            datasets: [
              {
                label: 'Interceptions',
                data: data.map(d => parseInt(d.interceptions)),
                borderColor: '#EE4727',
                backgroundColor: '#EE4727',
                tension: 0.1,
              },
              {
                label: 'FBI Notifications',
                data: data.map(d => parseInt(d.notifications)),
                borderColor: '#61625D',
                backgroundColor: '#61625D',
                tension: 0.1,
              },
            ],
          });
        } else if (id === 'cumulative-stats-bar') {
          // Stacked bar chart for cumulative stats
          setChartData({
            labels: data.map(d => d.metric),
            datasets: [
              {
                label: 'Previous Total',
                data: data.map(d => parseInt(d.previous_total)),
                backgroundColor: '#50534D',
              },
              {
                label: 'August 2025',
                data: data.map(d => parseInt(d.current_month)),
                backgroundColor: '#EE4727',
              },
            ],
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dataUrl, id]);

  const options: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: Boolean(title),
        text: title,
      },
    },
    scales: {
      x: {
        stacked: type === 'bar',
      },
      y: {
        stacked: type === 'bar',
        title: {
          display: true,
          text: type === 'bar' ? 'Cumulative Count' : 'Count',
        },
      },
    },
  };

  if (loading) {
    return (
      <figure className="my-8 w-full">
        <div className="w-full h-80 flex items-center justify-center border rounded-lg bg-gray-50">
          <p className="text-gray-500">Loading chart...</p>
        </div>
      </figure>
    );
  }

  return (
    <figure className="my-8 w-full">
      <div className="w-full" style={{ height: '400px' }}>
        {type === 'line'
          ? (
            chartData && (
              <Line
                data={chartData as ChartData<'line', number[], string>}
                options={options as ChartOptions<'line'>}
              />
            )
          )
          : (
            chartData && (
              <Bar
                data={chartData as ChartData<'bar', number[], string>}
                options={options as ChartOptions<'bar'>}
              />
            )
          )}
      </div>
      {description && (
        <figcaption className="mt-4 text-sm text-dim-gray text-center italic">
          {description}
        </figcaption>
      )}
    </figure>
  );
}
