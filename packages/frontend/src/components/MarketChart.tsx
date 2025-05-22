// packages\frontend\src\components\MarketChart.tsx

import React, { useEffect, useRef, memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
    createChart,
    IChartApi,
    UTCTimestamp,
    CandlestickData,
    CandlestickSeries,
    ColorType,
     // Optional: For styling options
} from 'lightweight-charts';

// --- Type Definitions ---

// Expected structure from backend API's OHLC array
type BackendOhlcEntry = [string, number, number, number, number, number, number]; // [timeStr, o, h, l, c, v, oi]

// Simplified response structure focusing only on OHLC
interface HistoricalDataResponse {
    ohlc: BackendOhlcEntry[];
    // indicators property is ignored in this simplified version
}

// Props for the component
interface MarketChartProps {
    symbol: string;
    interval: string;
    from: string;
    to: string;
}

// --- Helper Functions ---

// Convert ISO string or other date formats to UTCTimestamp (seconds)
const toUTCTimestamp = (dateString: string): UTCTimestamp => {
    return Math.floor(new Date(dateString).getTime() / 1000) as UTCTimestamp;
};

// --- Chart Component ---

const MarketChart: React.FC<MarketChartProps> = memo(({ symbol, interval, from, to }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    // Ref only needed for the candlestick series if we plan to update it later (e.g., WS)
    // const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

    const queryKey = ['historicalData', symbol, interval, from, to];

    const { data, isLoading, isError, error } = useQuery<HistoricalDataResponse, Error>({
        queryKey: queryKey,
        queryFn: async () => {
            const response = await axios.get<HistoricalDataResponse>(
                `http://localhost:5000/api/marketdata/historical`, {
                params: { symbol, interval, from, to },
            });
            // Basic validation
            if (!response.data || !response.data.ohlc) {
                throw new Error("OHLC data not found in API response");
            }
            return response.data;
        },
        enabled: !!symbol && !!interval && !!from && !!to,
        staleTime: 1000 * 60 * 15, // 15 minutes
        refetchOnWindowFocus: false,
        retry: 1,
    });

    // Effect for Chart Creation and Data Loading
    useEffect(() => {
        if (!data || !chartContainerRef.current || data.ohlc.length === 0) {
            return; // Exit if data/ref not ready or no data
        }

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                    // Ensure container has height defined via CSS or style prop
                    // height: chartContainerRef.current.clientHeight
                });
                chartRef.current.timeScale().fitContent();  
            }
        };

        // --- Create Chart ---
        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 500, // Adjusted default height for simpler chart
            layout: {
                background: { type: ColorType.Solid, color: '#ffffff' },
                textColor: '#333',
            },
            grid: { vertLines: { color: '#e1e1e1' }, horzLines: { color: '#e1e1e1' } },
            crosshair: { mode: 1 /* CrosshairMode.Normal */ },
            rightPriceScale: { visible: true, borderColor: '#cccccc' },
            timeScale: {
                visible: true,
                borderColor: '#cccccc',
                timeVisible: true,
                secondsVisible: interval.includes('minute'),
                fixLeftEdge: true,
                fixRightEdge: true,
                lockVisibleTimeRangeOnResize: true,
              },
        });
        chartRef.current = chart; // Store chart instance

        // --- Process and Add Candlestick Series Only ---
        const candleData: CandlestickData[] = data.ohlc
            .map(d => ({
                time: toUTCTimestamp(d[0]), // time: UNIX timestamp (seconds)
                open: d[1],
                high: d[2],
                low: d[3],
                close: d[4],
            }))
            .sort((a, b) => a.time - b.time); // Ensure data is sorted by time ASC

        // --- Process and Add Candlestick Series Only ---
        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
            title: symbol, // Display symbol as series title
        });
        candleSeries.setData(candleData);

        chart.timeScale().fitContent(); // Fit content after data is set

        // --- Setup Resize Observer ---
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(chartContainerRef.current);

        // --- Cleanup ---
        return () => {
            resizeObserver.disconnect();
            chart.remove(); // Use the local 'chart' instance for removal
            chartRef.current = null;
        };
    // IMPORTANT: Dependency array includes all props used in query/chart setup
    }, [data, symbol, interval]); // Re-run if data, symbol, or interval changes

    // --- Render Component ---
    if (isLoading) {
        return <div style={containerStyle}><p>Loading chart data...</p></div>;
    }

    if (isError) {
        return <div style={{ ...containerStyle, color: 'red' }}>
                   <p>Error loading chart data: {error?.message || 'Unknown error'}</p>
               </div>;
    }

    // Render the div container for the chart
    return <div ref={chartContainerRef} style={{ width: '100%', height: '500px' /* Match initial chart height */ }} />;
});

// Helper style for loading/error states
const containerStyle: React.CSSProperties = {
    height: '500px', // Match chart height
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px dashed #ccc',
    color: '#888',
};

export default MarketChart;