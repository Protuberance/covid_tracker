import React from "react";
import * as d3 from "d3";

const Arc = ({ data, index, createArc, colors }) => (
    <g key={index} className="arc">
        <path className="arc" d={createArc(data)} fill={colors(index)} />
        <text
            transform={`translate(${createArc.centroid(data)})`}
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="white"
            fontSize="10"
        >
            {data.value}
        </text>
    </g>
);

const Label = ({ data, index, outerRadius, radius }) => {

    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    function getTranslate() {
        let pos = outerRadius.centroid(data);
        pos[0] = radius * (midAngle(data) < Math.PI ? 1 : -1);
        return `translate (${pos})`;
    }

    return (
        <text key={index} dy='.35em' transform={getTranslate()} textAnchor={midAngle(data) < Math.PI ? "start" : "end"}>{data.data.name}</text>
    );
};

const Line = ({ data, index, createArc, outerRadius, radius }) => {

    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    function getTranslate() {
        let pos = outerRadius.centroid(data);
        pos[0] = radius * 0.95 * (midAngle(data) < Math.PI ? 1 : -1);
        return pos;
    }

    return (
        <polyline key={index} points={`${createArc.centroid(data)}, ${outerRadius.centroid(data)}, ${getTranslate()}`} fill="none" stroke="black" opacity='0.3'></polyline>
    )
}

const Pie = props => {
    const createPie = d3
        .pie()
        .value(d => d.value)
        .sort(null);
    const createArc = d3
        .arc()
        .innerRadius(props.innerRadius)
        .outerRadius(props.outerRadius);

    const outerRadius = d3
        .arc()
        .innerRadius(props.outerRadius * 1.1)
        .outerRadius(props.outerRadius * 1.1)

    const colors = d3.scaleOrdinal(d3.schemeCategory10);
    const data = createPie(props.data);
    console.log(data);

    return (
        <svg width={props.width} height={props.height}>
            <g transform={`translate(${props.width / 2} ${props.height / 2})`}>
                {data.map((d, i) => (
                    <g key={i}><Arc
                        data={d}
                        index={i}
                        createArc={createArc}
                        colors={colors}
                    />
                        <Label
                            data={d}
                            index={i}
                            outerRadius={outerRadius}
                            radius={props.height / 2}
                        />
                        <Line
                            data={d}
                            index={i}
                            createArc={createArc}
                            outerRadius={outerRadius}
                            radius={props.height / 2}
                        />

                    </g>
                ))}
            </g>
        </svg>
    );
};

export default Pie;
