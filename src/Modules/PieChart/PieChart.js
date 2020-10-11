import React, { useEffect, useRef } from "react";
import { animated, useSpring } from "react-spring";
import * as d3 from "d3";

const colors = d3.scaleOrdinal(d3.schemeCategory10);
const format = d3.format(".0f");
const animationDuration = 250;
const animationConfig = {
    to: async (next, cancel) => {
        await next({ t: 1 });
    },
    from: { t: 0 },
    config: { duration: animationDuration },
    reset: true
};

const Arc = ({ index, from, to, createArc, colors, format, animatedProps }) => {
    const interpolator = d3.interpolate(from, to);

    return (
        <g key={index} className="arc">
            <animated.path
                className="arc"
                d={animatedProps.t.interpolate(t => createArc(interpolator(t)))}
                fill={colors(index)}
            />
            <animated.text
                transform={animatedProps.t.interpolate(
                    t => `translate(${createArc.centroid(interpolator(t))})`
                )}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="white"
                fontSize="10"
            >
                {animatedProps.t.interpolate(t => format(interpolator(t).value))}
            </animated.text>
        </g>
    )
};

const Label = ({ index, outerRadius, radius, from, to, format, animatedProps }) => {
    const interpolator = d3.interpolate(from, to);

    function midAngle(date) {
        return date.startAngle + (date.endAngle - date.startAngle) / 2;
    }

    function getTranslate(date) {
        let pos = outerRadius.centroid(date);
        pos[0] = radius * (midAngle(date) < Math.PI ? 1 : -1);
        return `translate (${pos})`;
    }

    return (
        <animated.text
            key={index}
            dy='.35em'
            transform={animatedProps.t.interpolate(t => getTranslate(interpolator(t)))}
            textAnchor={animatedProps.t.interpolate(t => midAngle(interpolator(t)) < Math.PI ? "start" : "end")}>
            {animatedProps.t.interpolate(t => interpolator(t).data.name)}
        </animated.text>
    );
};

const Line = ({ data, index, createArc, outerRadius, radius, from, to, animatedProps }) => {
    const interpolator = d3.interpolate(from, to);

    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    function getTranslate(d) {
        let pos = outerRadius.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        console.log(pos);
        return [createArc.centroid(data), outerRadius.centroid(data), pos];
    }

    return (
        <animated.polyline
            key={index}
            points={animatedProps.t.interpolate(t => getTranslate(interpolator(t)))}
            fill="none"
            stroke="black"
            opacity='0.3'>
        </animated.polyline>
    );
};

const Pie = props => {
    const cache = useRef([]);
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

    const data = createPie(props.data);
    const previousData = createPie(cache.current);

    const [animatedProps, setAnimatedProps] = useSpring(() => animationConfig);
    setAnimatedProps(animationConfig);

    useEffect(() => {
        cache.current = props.data;
    });

    return (
        <svg width={props.width} height={props.height}>
            <g transform={`translate(${props.width / 2} ${props.height / 2})`}>
                {data.map((d, i) => (
                    <g key={i}><Arc
                        key={i}
                        index={i}
                        from={previousData[i]}
                        to={d}
                        createArc={createArc}
                        colors={colors}
                        format={format}
                        animatedProps={animatedProps}
                    />
                        <Label
                            index={i}
                            outerRadius={outerRadius}
                            radius={props.height / 2}
                            from={previousData[i]}
                            to={d}
                            format={format}
                            animatedProps={animatedProps}
                        />
                        <Line
                            data={d}
                            index={i}
                            createArc={createArc}
                            outerRadius={outerRadius}
                            radius={props.height / 2}
                            from={previousData[i]}
                            to={d}
                            animatedProps={animatedProps}
                        />

                    </g>
                ))}
            </g>
        </svg>
    );
};

export default Pie;