import * as d3 from "d3";
import { useRef, useEffect } from "react";

export default function BarChart({
  data,
  width = 480, // Alterado para menor
  height = 300, // Alterado para menor
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 40
}) {
  const gx = useRef();
  const gy = useRef();

  const x = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([marginLeft, width - marginRight])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .nice()
    .range([height - marginBottom, marginTop]);

  useEffect(() => {
    d3.select(gx.current)
      .call(d3.axisBottom(x).tickFormat(i => i + 1))
      .selectAll("text")
      .style("font-size", "12px"); // Reduz tamanho da fonte
    d3.select(gy.current)
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "12px"); // Reduz tamanho da fonte
  }, [gx, gy, x, y]);

  return (
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <g fill="steelblue">
        {data.map((d, i) => (
          <rect
            key={i}
            x={x(i)}
            y={y(d)}
            width={x.bandwidth()}
            height={y(0) - y(d)}
          />
        ))}
      </g>
    </svg>
  );
}
