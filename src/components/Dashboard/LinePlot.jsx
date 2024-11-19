import * as d3 from "d3";
import { useRef, useEffect } from "react";

export default function LinePlot({
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
  const x = d3.scaleLinear([0, data.length - 1], [marginLeft, width - marginRight]);
  const y = d3.scaleLinear(d3.extent(data), [height - marginBottom, marginTop]);
  const line = d3.line((d, i) => x(i), y);

  useEffect(() => {
    d3.select(gx.current)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "12px"); // Reduz tamanho da fonte
  }, [gx, x]);

  useEffect(() => {
    d3.select(gy.current)
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "12px"); // Reduz tamanho da fonte
  }, [gy, y]);

  return (
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <path fill="none" stroke="currentColor" strokeWidth="1.5" d={line(data)} />
      <g fill="white" stroke="currentColor" strokeWidth="1.5">
        {data.map((d, i) => (<circle key={i} cx={x(i)} cy={y(d)} r="2.5" />))}
      </g>
    </svg>
  );
}
