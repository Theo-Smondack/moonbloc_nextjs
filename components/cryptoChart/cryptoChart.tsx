import styles from './cryptoChart.module.css'
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import {Line} from "react-chartjs-2";
import React, {useRef, useState} from "react";
import {CryptoChartProps} from "../../types/props";
import useSWR from "swr";
import {defaultDataFetcher} from "../../utils/fetchers";
import {useCurrencyContext} from "../../context/currency";
import {useTheme} from "next-themes";
import {findMinMax} from "../../utils/toolFunctions";

const CryptoChart = ({id}: CryptoChartProps) => {

    const [timeframe, setTimeframe] = useState<string>('1');
    const chartRef = useRef();
    const theme = useTheme();
    const dashLineColor = theme.theme === 'light' ? '#dedbde' : '#3A4750'

    // const handleMouseMove = (e: any) => {
    //     const chart = chartRef.current
    //     if (chart) {
    //         const {scales: {x}, ctx} = chart as Chart;
    //         const xCoor = e.nativeEvent.offsetX;
    //         const index = x.getValueForPixel(xCoor) as number;
    //         console.log(`value : ${cryptoOHLC[index]} ${value.state.currency?.symbol} \n date : ${labels[index]} `)
    //     }
    // }

    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)


    const value = useCurrencyContext();
    const currency = value.state.currency?.value.toLowerCase() as string
    const url: string = `/api/cryptocurrency/ohlc/${id}?currency=${currency}&days=${timeframe}`;
    const {data, error} = useSWR(url, defaultDataFetcher)
    if (error) return <div className='container'> failed to load </div>
    if (!data) return (
        <div className={styles.container}>
            <div className={styles.timeFrameContainer}>
                <div className={timeframe === '1' ? styles.active : ''}
                     onClick={() => setTimeframe('1')}>24h
                </div>
                <div className={timeframe === '7' ? styles.active : ''}
                     onClick={() => setTimeframe('7')}>7d
                </div>
                <div className={timeframe === '30' ? styles.active : ''}
                     onClick={() => setTimeframe('30')}>1m
                </div>
                <div className={timeframe === '90' ? styles.active : ''}
                     onClick={() => setTimeframe('90')}>3m
                </div>
                <div className={timeframe === '180' ? styles.active : ''}
                     onClick={() => setTimeframe('180')}>6m
                </div>
                <div className={timeframe === '365' ? styles.active : ''}
                     onClick={() => setTimeframe('365')}>1y
                </div>
            </div>
            <div className={styles.loading}></div>
        </div>
    )
    const {labels, parsedLabels, cryptoOHLC} = data;
    const chartLabels = parseInt(timeframe) >= 30 ? labels : parsedLabels
    const cryptoData = {
        labels: chartLabels,
        datasets: [
            {
                data: cryptoOHLC,
                borderColor: '#2185D5',
                backgroundColor: '#9BD0F5',
                pointRadius: 0,
                pointHoverRadius: 5,
                showLine: true,
                fill: {
                    target: "origin", // 3. Set the fill options
                    above: "rgba(33,133,213,0.3)"
                }
            }
        ]
    };

    const {min, max} = findMinMax(cryptoData.datasets[0].data);
    const minVal = min - (max-min) > 0 ? min - (max-min) : 0
    const maxVal = max + (max-min)

    const tooltipLine = {
        id: 'tooltipLine',
        beforeDraw: (chart: any) => {
            if (chart.tooltip._active && chart.tooltip._active.length) {
                const {ctx} = chart;
                ctx.save();
                const activePoint = chart.tooltip._active[0];
                const {chartArea} = chart;
                //Line from top to point
                ctx.beginPath();
                ctx.setLineDash([5, 7]);
                ctx.moveTo(activePoint.element.x, chartArea.top);
                ctx.lineTo(activePoint.element.x, activePoint.element.y);
                ctx.lineWidth = 2;
                ctx.strokeStyle = dashLineColor;
                ctx.stroke();
                ctx.restore();
                //Line from point to bottom
                ctx.beginPath();
                ctx.moveTo(activePoint.element.x, activePoint.element.y);
                ctx.lineTo(activePoint.element.x, chartArea.bottom);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#2185D5';
                ctx.stroke();
                ctx.restore();
            }
        }
    }


    const options = {
        responsive: true,
        maintainAspectRatio: false,
        hover: {
            intersect: false,
            mode: "nearest" as "nearest",
            axis: "x" as "x",
        },


        tension: 0.3,
        scales: {
            y: {
                min: minVal as number,
                max: maxVal as number,
            },
            x: {
                grid: {
                    display: false,
                },
            }
        },
        plugins: {
            tooltip: {
                displayColors: false,
                mode: "nearest" as "nearest",
                axis: "x" as "x",
                yAlign: "bottom" as "bottom",
                intersect: false,
                callbacks: {
                    title: function (context: any) {
                        return `${labels[context[0].dataIndex]}`
                    },
                    label: function (context: any) {
                        return `${(Math.floor(context.dataset.data[context.dataIndex] * 10000) / 10000).toLocaleString()}${value.state.currency?.symbol}`
                    },
                }
            },
            legend: {
                display: false,
            },
        },
    };

    return (
        <div className={styles.container}>
            <div className={styles.timeFrameContainer}>
                <div className={timeframe === '1' ? styles.active : ''}
                     onClick={() => setTimeframe('1')}>24h
                </div>
                <div className={timeframe === '7' ? styles.active : ''}
                     onClick={() => setTimeframe('7')}>7d
                </div>
                <div className={timeframe === '30' ? styles.active : ''}
                     onClick={() => setTimeframe('30')}>1m
                </div>
                <div className={timeframe === '90' ? styles.active : ''}
                     onClick={() => setTimeframe('90')}>3m
                </div>
                <div className={timeframe === '180' ? styles.active : ''}
                     onClick={() => setTimeframe('180')}>6m
                </div>
                <div className={timeframe === '365' ? styles.active : ''}
                     onClick={() => setTimeframe('365')}>1y
                </div>
            </div>
            <Line data={cryptoData} options={options} ref={chartRef} plugins={[tooltipLine]}/>
            {/*onMouseMove={handleMouseMove}/>*/}
        </div>
    )


}
export default CryptoChart