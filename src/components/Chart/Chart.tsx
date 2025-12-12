import { Line } from 'react-chartjs-2';
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Tooltip,
  Chart as ChartJS,
} from 'chart.js';
import moment from 'moment';
import { PRIMARY } from 'styles/colors';
import * as S from './style';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export type ChartDatasetsType = {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
};

export type ChartDataType = {
  labels: string[];
  datasets: ChartDatasetsType[];
};

type Props = {
  data: {
    date: string;
    count: number;
  }[];
};

export function Chart({ data }: Props) {
  const chartData = {
    labels: data?.map((v) => moment(v.date).format('MM-DD')),
    datasets: [
      {
        data: data?.map((v) => v.count),
        borderColor: PRIMARY,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <S.Container>
      <Line
        data={chartData}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              ticks: {
                count: 5,
              },
            },
          },
        }}
        style={{
          height: 200,
          width: '85%',
        }}
      />
    </S.Container>
  );
}
