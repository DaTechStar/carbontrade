"use client";

import React from "react";
import {
  AdvancedRealTimeChart,
  MiniChart,
  MarketOverview,
  TechnicalAnalysis,
  SymbolOverview,
} from "react-ts-tradingview-widgets";

export type ChartType = "advanced" | "mini" | "overview" | "technical" | "profile";

export interface MarketChartProps {
  type: ChartType;
  symbol?: string;
  interval?: "1" | "3" | "5" | "15" | "30" | "60" | "240" | "D" | "W";
  height?: string | number;
  width?: string | number;
  autosize?: boolean;
  theme?: "dark" | "light";
  isTransparent?: boolean;
  overviewTabs?: Array<{
    title: string;
    symbols: Array<{ s: string; d: string }>;
    originalTitle?: string;
  }>;
  showFloatingTooltip?: boolean;
  showSymbolLogo?: boolean;
  showVolume?: boolean;
}

export function MarketChart({
  type,
  symbol = "NASDAQ:AAPL",
  interval = "D",
  height = "100%",
  width = "100%",
  autosize = true,
  theme = "dark",
  isTransparent = false,
  overviewTabs,
  showFloatingTooltip = true,
  showSymbolLogo = true,
  showVolume = false,
}: MarketChartProps) {
  switch (type) {
    case "advanced":
      return (
        <AdvancedRealTimeChart
          theme={theme}
          symbol={symbol}
          interval={interval}
          height={height}
          width={width}
          autosize={autosize}
          {...({ isTransparent } as any)}
          showIntervalTabs={true}
          locale="en"
          style="1"
          hide_side_toolbar={false}
          allow_symbol_change={true}
          save_image={false}
        />
      );

    case "mini":
      return (
        <MiniChart
          colorTheme={theme}
          symbol={symbol}
          height={height}
          width={width}
          autosize={autosize}
          isTransparent={isTransparent}
          dateRange="1D"
        />
      );

    case "technical":
      return (
        <TechnicalAnalysis
          colorTheme={theme}
          symbol={symbol}
          height={height}
          width={width}
          autosize={autosize}
          isTransparent={isTransparent}
          showIntervalTabs={true}
        />
      );

    case "overview":
      return (
        <MarketOverview
          colorTheme={theme}
          height={height}
          width={width}
          autosize={autosize}
          isTransparent={isTransparent}
          showFloatingTooltip={showFloatingTooltip}
          showSymbolLogo={showSymbolLogo}
          tabs={overviewTabs as any}
        />
      );

    case "profile":
      return (
        <SymbolOverview
          colorTheme={theme}
          symbols={[[symbol]]}
          height={height}
          width={width}
          autosize={autosize}
          isTransparent={isTransparent}
          chartType="area"
          downColor="#ff3b30"
          upColor="#34c759"
          showVolume={showVolume}
          dateFormat="MMM dd, yyyy"
        />
      );

    default:
      return null;
  }
}
