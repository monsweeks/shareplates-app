import React from 'react';
import './AvatarBuilder.scss';
import Color from 'color';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { Card, CardBody, CardHeader, CircleIcon, Nav, NavItem } from '@/components';

const allColors = [
  '#f7a584',
  '#0b2c48',
  '#e36a41',
  '#008162',
  '#6db8de',
  '#2782ab',
  '#ea8723',
  '#51646f',
  '#e87f72',
  '#f18c80',
  '#f7b1ad',
  '#f0ca4a',
  '#e83837',
  '#55a896',
  '#833b23',
  '#ffffff',
  '#553030',
  '#b8bec2',
  '#f58f63',
  '#641b1b',
  '#ba4a27',
  '#f59d6d',
  '#eec84c',
  '#fca886',
];

console.log(allColors);

const bgColors = ['#FFF', '#111', '#0b2c48', '#008162', '#51646f', '#e83837', '#553030', '#641b1b', '#eec84c'];
const clothColors = [
  '#0b2c48',
  '#e36a41',
  '#6db8de',
  '#2782ab',
  '#ea8723',
  '#51646f',
  '#e87f72',
  '#f18c80',
  '#f7b1ad',
  '#f0ca4a',
  '#e83837',
  '#55a896',
  '#ffffff',
  '#553030',
  '#b8bec2',
  '#f58f63',
  '#641b1b',
  '#ba4a27',
  '#eec84c',
];

const forms = [
  {
    cx: 188.9,
    cy: 572.1,
    tag: (faceColor = '#f7a584', darkenColor = '#F5936B', clothColor = '#0b2c48') => {
      return (
        <>
          <g>
            <g>
              <path
                style={{
                  fill: darkenColor,
                }}
                d="M173.2,566c1.5,4.5,0.7,8.9-1.9,9.8c-2.6,0.9-5.9-2-7.4-6.5c-1.5-4.5-0.7-8.9,1.9-9.8
					C168.3,558.6,171.7,561.5,173.2,566z"
              />
              <path
                style={{
                  fill: darkenColor,
                }}
                d="M204.5,566c-1.5,4.5-0.7,8.9,1.9,9.8c2.6,0.9,5.9-2,7.4-6.5c1.5-4.5,0.7-8.9-1.9-9.8
					C209.4,558.6,206.1,561.5,204.5,566z"
              />
            </g>
            <path
              style={{
                fill: clothColor,
              }}
              d="M234.4,635l0-0.2c0-12.9-4.7-25.5-10.4-27.9l-24.4-10.1c-5.7-2.4-15.1-2.4-20.9,0L153.8,607
				c-5.7,2.4-10.4,14.9-10.4,27.8l0,0.2H234.4z"
            />
            <path
              style={{
                fill: darkenColor,
              }}
              d="M199.8,599.9c0,5.7-4.6,10.3-10.3,10.3h-1.2c-5.7,0-10.3-4.6-10.3-10.3v-26.6c0-5.7,4.6-10.3,10.3-10.3h1.2
				c5.7,0,10.3,4.6,10.3,10.3V599.9z"
            />
            <path
              style={{
                fill: faceColor,
              }}
              d="M210.1,551.8c0-8.9-9.5-16.1-21.3-16.1c-11.7,0-21.3,7.2-21.3,16.1c0,0.8,0.1,1.6,0.2,2.4l3.4,29.5
				c0,4.4,3.7,8,8.2,8h19.4c4.5,0,8.2-3.6,8.2-8l2.9-29.5C210,553.5,210.1,552.7,210.1,551.8z"
            />
          </g>
        </>
      );
    },
  },

  {
    cx: 189,
    cy: 225.5,
    tag: (faceColor = '#f7a584', darkenColor = '#F5936B', clothColor = '#0b2c48') => {
      return (
        <>
          <g>
            <path
              style={{
                fill: darkenColor,
              }}
              d="M173.4,217.2c1.5,4.5,0.7,8.9-1.9,9.8c-2.6,0.9-5.9-2-7.4-6.5c-1.5-4.5-0.7-8.9,1.9-9.8
				C168.5,209.8,171.8,212.7,173.4,217.2z"
            />
            <path
              style={{
                fill: darkenColor,
              }}
              d="M204.7,217.2c-1.5,4.5-0.7,8.9,1.9,9.8c2.6,0.9,5.9-2,7.4-6.5c1.5-4.5,0.7-8.9-1.9-9.8
				C209.6,209.8,206.2,212.7,204.7,217.2z"
            />
          </g>
          <path
            style={{
              fill: clothColor,
            }}
            d="M240.7,292.5l0-0.2c0-14.4-5.3-28.3-11.9-31L201.1,250c-6.5-2.7-17.2-2.7-23.7,0l-28.2,11.4
			c-6.5,2.6-11.9,16.6-11.9,30.9l0,0.2H240.7z"
          />
          <rect
            x="176.8"
            y="238.4"
            style={{
              fill: darkenColor,
            }}
            width="24.6"
            height="16.4"
          />
          <g>
            <path
              style={{
                fill: faceColor,
              }}
              d="M210,221.6c0,12.1-9.4,21.8-21,21.8l0,0c-11.6,0-21-9.8-21-21.8V209c0-12.1,9.4-21.8,21-21.8l0,0
				c11.6,0,21,9.8,21,21.8V221.6z"
            />
          </g>
          <g>
            <polygon
              style={{
                fill: Color(clothColor)
                  .darken(0.3)
                  .hex(),
              }}
              points="180.7,263.1 168.8,255.3 172.5,246.6 189,251.4 			"
            />
            <g>
              <polygon
                style={{
                  fill: Color(clothColor)
                    .darken(0.3)
                    .hex(),
                }}
                points="197.4,263.1 209.3,255.3 205.6,246.6 189.1,251.4 				"
              />
            </g>
          </g>
        </>
      );
    },
  },

  {
    cx: 420.9,
    cy: 225.5,
    tag: (faceColor = '#f7a584', darkenColor = '#F5936B', clothColor = '#0b2c48') => {
      return (
        <>
          <path
            style={{
              fill: clothColor,
            }}
            d="M472.8,292.5l0-0.2c0-14.4-5.4-28.3-11.9-31L433,250c-6.5-2.7-17.3-2.7-23.8,0l-28.3,11.4
			c-6.6,2.6-11.9,16.6-11.9,30.9l0,0.2H472.8z"
          />
          <path
            style={{
              fill: darkenColor,
            }}
            d="M431.8,251c0,5.7-4.6,10.3-10.3,10.3h-1.2c-5.7,0-10.3-4.6-10.3-10.3v-26.6c0-5.7,4.6-10.3,10.3-10.3h1.2
			c5.7,0,10.3,4.6,10.3,10.3V251z"
          />

          <g>
            <path
              style={{
                fill: darkenColor,
              }}
              d="M405.1,219.4c1.5,4.5,0.7,8.9-1.9,9.8c-2.6,0.9-5.9-2-7.5-6.5c-1.5-4.5-0.7-8.9,1.9-9.8
				C400.3,212,403.6,214.9,405.1,219.4z"
            />
            <path
              style={{
                fill: darkenColor,
              }}
              d="M436.6,219.4c-1.5,4.5-0.7,8.9,1.9,9.8c2.6,0.9,5.9-2,7.5-6.5c1.5-4.5,0.7-8.9-1.9-9.8
				C441.5,212,438.2,214.9,436.6,219.4z"
            />
          </g>
          <g>
            <path
              style={{
                fill: faceColor,
              }}
              d="M442,221.9c0,12.1-9.4,21.8-21.1,21.8l0,0c-11.7,0-21.1-9.8-21.1-21.8v-12.6c0-12.1,9.4-21.8,21.1-21.8l0,0
				c11.6,0,21.1,9.8,21.1,21.8V221.9z"
            />
          </g>
        </>
      );
    },
  },

  {
    cx: 305,
    cy: 225.5,

    tag: (faceColor = '#f7a584', darkenColor = '#F5936B', clothColor = '#0b2c48') => {
      return (
        <>
          <path
            style={{
              fill: darkenColor,
            }}
            d="M356.8,292.5l0-0.2c0-14.4-5.4-28.3-11.9-31L317.1,250c-6.5-2.7-17.2-2.7-23.8,0l-28.2,11.4
			c-6.5,2.6-11.9,16.6-11.9,30.9l0,0.2H356.8z"
          />
          <path
            style={{
              fill: darkenColor,
            }}
            d="M314.4,249.8c0,4.9-4,8.9-8.8,8.9h-1.1c-4.9,0-8.8-4-8.8-8.9v-22.9c0-4.9,4-8.9,8.8-8.9h1.1
			c4.9,0,8.8,4,8.8,8.9V249.8z"
          />
          <g>
            <path
              style={{
                fill: darkenColor,
              }}
              d="M289.3,220.5c1.5,3.5,0.7,6.8-1.9,7.5c-2.6,0.7-5.9-1.6-7.5-5c-1.5-3.5-0.7-6.8,1.9-7.5
				C284.4,214.8,287.7,217.1,289.3,220.5z"
            />
            <path
              style={{
                fill: darkenColor,
              }}
              d="M320.7,220.5c-1.5,3.5-0.7,6.8,1.9,7.5c2.6,0.7,5.9-1.6,7.5-5c1.5-3.5,0.7-6.8-1.9-7.5
				C325.6,214.8,322.2,217.1,320.7,220.5z"
            />
          </g>
          <g>
            <path
              style={{
                fill: faceColor,
              }}
              d="M326,221.9c0,12.1-9.4,21.8-21.1,21.8l0,0c-11.6,0-21.1-9.8-21.1-21.8v-12.6c0-12.1,9.4-21.8,21.1-21.8l0,0
				c11.6,0,21.1,9.8,21.1,21.8V221.9z"
            />
          </g>
          <path
            style={{
              fill: clothColor,
            }}
            d="M356.8,292.3c0-14.4-5.4-28.3-11.9-31l-21-8.5L305,267.4l-18.8-14.5l-21.1,8.5c-6.5,2.6-11.9,16.6-11.9,30.9
			l0,0.2h103.7L356.8,292.3z"
          />
        </>
      );
    },
  },

  {
    cx: 537.1,
    cy: 225.5,
    tag: (faceColor = '#f7a584', darkenColor = '#F5936B', clothColor = '#0b2c48') => {
      return (
        <>
          <path
            style={{
              fill: darkenColor,
            }}
            d="M578.4,281.7l0-0.2c0-11.4-4.3-22.5-9.5-24.6l-22.2-9c-5.2-2.1-13.8-2.1-19,0l-22.5,9
			c-5.2,2.1-9.5,13.2-9.5,24.6l0,0.2H578.4z"
          />
          <path
            style={{
              fill: darkenColor,
            }}
            d="M546.5,248.5c0,4.9-4,8.9-8.9,8.9h-1.1c-4.9,0-8.9-4-8.9-8.9v-22.9c0-4.9,4-8.9,8.9-8.9h1.1
			c4.9,0,8.9,4,8.9,8.9V248.5z"
          />
          <g>
            <path
              style={{
                fill: darkenColor,
              }}
              d="M522.2,219.2c1.5,3.5,0.7,6.8-1.8,7.5c-2.4,0.7-5.6-1.6-7.1-5c-1.5-3.5-0.7-6.8,1.8-7.5
				C517.6,213.5,520.7,215.7,522.2,219.2z"
            />
            <path
              style={{
                fill: darkenColor,
              }}
              d="M551.9,219.2c-1.5,3.5-0.7,6.8,1.8,7.5c2.4,0.7,5.6-1.6,7.1-5c1.5-3.5,0.7-6.8-1.8-7.5
				C556.6,213.5,553.4,215.7,551.9,219.2z"
            />
          </g>
          <g>
            <path
              style={{
                fill: faceColor,
              }}
              d="M558.2,220.6c0,12.1-9.4,21.8-21.1,21.8l0,0c-11.7,0-21.1-9.8-21.1-21.8V208c0-12.1,9.4-21.8,21.1-21.8l0,0
				c11.7,0,21.1,9.8,21.1,21.8V220.6z"
            />
          </g>
          <path
            style={{
              fill: clothColor,
            }}
            d="M578.4,281.5c0-11.4-4.3-22.5-9.5-24.6l-16.8-6.8l-15.1,11.6l-15-11.5l-16.8,6.7c-5.2,2.1-9.5,13.2-9.5,24.6
			l0,0.2h82.7L578.4,281.5z"
          />
        </>
      );
    },
  },
];

const hairs = [
  {
    cx: 421,
    cy: 1093,
    backTag: (hairColor = '#282828') => {
      return (
        <>
          <g>
            <path
              style={{
                fill: hairColor,
              }}
              d="M451.3,1141.1l4.2-22.4l-5.1-1l-5.2,27.3c-0.7,3.8,1.7,7.6,5.4,8.3c3.1,0.6,6.1-1,7.4-3.8
		c-0.4,0-0.9,0-1.3-0.1C453,1148.7,450.6,1145,451.3,1141.1z"
            />
            <path
              style={{
                fill: hairColor,
              }}
              d="M491.1,1141.1l-4.2-22.4l5.1-1l5.2,27.3c0.7,3.8-1.7,7.6-5.4,8.3c-3.1,0.6-6.1-1-7.4-3.8c0.4,0,0.9,0,1.3-0.1
		C489.4,1148.7,491.8,1145,491.1,1141.1z"
            />
          </g>
        </>
      );
    },
    foreTag: (hairColor = '#282828') => {
      return (
        <>
          <path
            style={{
              fill: hairColor,
            }}
            d="M452.2,1133.2c-0.4-1.7-0.6-3.4-0.6-5.2c0-11.4,8.9-20.7,19.8-20.7c11,0,19.8,9.3,19.8,20.7
	c0,1.8-0.2,3.5-0.6,5.2h3.3c0.4-1.9,0.6-3.8,0.6-5.8c0-14.3-10.3-25.9-23-25.9c-12.7,0-23,11.6-23,25.9c0,2,0.2,3.9,0.6,5.8H452.2z"
          />
          <ellipse
            transform="matrix(0.3779 -0.9258 0.9258 0.3779 -734.6248 1134.8734)"
            style={{
              fill: hairColor,
            }}
            cx="477.2"
            cy="1114.1"
            rx="6.8"
            ry="15.6"
          />
          <ellipse
            transform="matrix(0.7635 -0.6458 0.6458 0.7635 -610.0317 561.2441)"
            style={{
              fill: hairColor,
            }}
            cx="461.2"
            cy="1113.5"
            rx="12.9"
            ry="5.3"
          />
        </>
      );
    },
  },
  {
    cx: 485,
    cy: 1090,

    backTag: (hairColor = '#282828') => {
      return (
        <>
          <polygon
            style={{
              fill: hairColor,
            }}
            points="511.2,1115.3 502.7,1153.5 566.7,1153.5 557.4,1115.3 	"
          />
          <ellipse
            style={{
              fill: hairColor,
            }}
            cx="534.7"
            cy="1153.7"
            rx="31.8"
            ry="9.2"
          />
          <ellipse
            style={{
              fill: hairColor,
            }}
            cx="534.7"
            cy="1119.4"
            rx="23.9"
            ry="21.9"
          />
        </>
      );
    },
    foreTag: (hairColor = '#282828') => {
      return (
        <>
          <g>
            <path
              style={{
                fill: hairColor,
              }}
              d="M534.7,1099.2c-12.4,0-22.4,10.9-22.4,24.3c0,4.5,1.1,8.6,3,12.2l3.7-18.9l31.4,0l3.6,18.9
			c1.9-3.6,3-7.8,3-12.2C557.1,1110.1,547,1099.2,534.7,1099.2z"
            />
          </g>
          <path
            style={{
              fill: hairColor,
            }}
            d="M548.2,1127.8c1.4-2.4,2.3-5.3,2.3-8.4c0-8.9-7.1-16.2-15.8-16.2c-8.7,0-15.8,7.2-15.8,16.2
		c0,3.1,0.8,5.9,2.3,8.4H548.2z"
          />
        </>
      );
    },
  },
  {
    cx: 309,
    cy: 1094,

    backTag: () => {
      return <></>;
    },
    foreTag: (hairColor = '#282828') => {
      return (
        <>
          <g>
            <polygon
              style={{
                fill: hairColor,
              }}
              points="378.1,1131.3 380.8,1131.4 380.9,1114.1 375.5,1111.2 		"
            />
            <polygon
              style={{
                fill: hairColor,
              }}
              points="337.3,1131.3 340,1131.3 342.9,1111.2 337.3,1114 		"
            />
          </g>
          <path
            style={{
              fill: hairColor,
            }}
            d="M377.4,1113c-0.4,4.1-9.1,6.7-19.5,5.7c-10.4-1-18.4-5.2-18.1-9.3c0.4-4.1,9.1-6.7,19.5-5.7
		C369.7,1104.7,377.8,1108.8,377.4,1113z"
          />
        </>
      );
    },
  },
];

const faces = [
  {
    cx: 581,
    cy: 343,
    tag: (
      <>
        <g>
          <ellipse className="st1" cx="624.2" cy="386.8" rx="2.2" ry="2.2" />
          <ellipse className="st1" cx="638.7" cy="386.8" rx="2.2" ry="2.2" />
        </g>
        <g>
          <g>
            <path
              className="st17"
              d="M639.2,401.3c-0.1-0.2-0.2-0.4-0.3-0.6c-0.6-1.2-2-1.7-3.4-1.4c-2.6,0.7-5.5,0.7-8.1,0
				c-1.3-0.4-2.8,0.1-3.4,1.4c-0.1,0.2-0.2,0.4-0.3,0.6C629.2,403.3,633.8,403.3,639.2,401.3z"
            />
          </g>
        </g>
        <g>
          <path
            className="st35"
            d="M628.7,379.5c0.3,1.4-0.6,2.9-2.1,3.2l-5.2,1.1c-1.4,0.3-2.8-0.6-3.1-2.1l0,0c-0.3-1.4,0.6-2.9,2.1-3.2
			l5.2-1.1C627,377.1,628.4,378,628.7,379.5L628.7,379.5z"
          />
          <path
            className="st35"
            d="M634.2,379.5c-0.3,1.4,0.6,2.9,2.1,3.2l5.2,1.1c1.4,0.3,2.8-0.6,3.1-2.1l0,0c0.3-1.4-0.6-2.9-2.1-3.2
			l-5.2-1.1C635.9,377.1,634.5,378,634.2,379.5L634.2,379.5z"
          />
        </g>
      </>
    ),
  },
  {
    cx: 540.5,
    cy: 345,
    tag: (
      <>
        <g>
          <circle className="st1" cx="583.6" cy="389.1" r="2.2" />
          <circle className="st1" cx="598.2" cy="389.1" r="2.2" />
        </g>
        <g>
          <g>
            <path
              className="st7"
              d="M579.9,384.3c1.5-1.3,3.5-1.8,5.4-1.2c1.7,0.5,2.4-2.1,0.7-2.6c-2.8-0.8-5.8-0.1-8,1.9
				C576.8,383.6,578.7,385.5,579.9,384.3L579.9,384.3z"
            />
          </g>
          <g>
            <path
              className="st7"
              d="M603.7,382.4c-2.2-2-5.1-2.7-8-1.9c-1.7,0.5-1,3,0.7,2.6c1.9-0.5,3.9-0.1,5.4,1.2
				C603.1,385.5,605,383.6,603.7,382.4L603.7,382.4z"
            />
          </g>
        </g>
        <g>
          <ellipse className="st13" cx="590.9" cy="400.2" rx="6.2" ry="4.3" />
          <ellipse className="st13" cx="590.9" cy="403.5" rx="6.2" ry="5.3" />
          <g>
            <path
              className="st1"
              d="M583.2,397.8c0.1,4.8,3.5,8.6,7.6,8.6s7.5-3.8,7.6-8.6c-2.1,1.1-4.8,1.8-7.6,1.8
				C588,399.6,585.4,398.9,583.2,397.8z"
            />
            <path
              className="st17"
              d="M586.6,402.3h8.6c0.7,0,1.3-0.6,1.3-1.3v-2.4c-1.7,0.6-3.6,0.9-5.6,0.9c-2,0-3.9-0.3-5.6-0.9v2.4
				C585.3,401.7,585.9,402.3,586.6,402.3z"
            />
          </g>
        </g>
      </>
    ),
  },
  {
    cx: 153.2,
    cy: 191,
    tag: (
      <>
        <g>
          <ellipse className="st1" cx="196.5" cy="235.3" rx="2.2" ry="2.2" />
          <ellipse className="st1" cx="211.1" cy="235.3" rx="2.2" ry="2.2" />
        </g>
        <g>
          <path
            className="st17"
            d="M208.4,246.9c-2.5,2.3-6.7,2.3-9.2,0c-1.7-1.7-4.4,1-2.6,2.7c4,3.8,10.5,3.8,14.5,0
				C212.8,247.9,210.2,245.2,208.4,246.9L208.4,246.9z"
          />
        </g>
        <g>
          <path
            className="st2"
            d="M199.9,227.8c0.2,0.9-0.4,1.8-1.3,1.9l-4.9,0.9c-0.9,0.2-1.8-0.4-1.9-1.4l0,0c-0.2-0.9,0.4-1.8,1.3-1.9
				l4.9-0.9C198.9,226.2,199.8,226.8,199.9,227.8L199.9,227.8z"
          />
          <path
            className="st2"
            d="M207.7,227.8c-0.2,0.9,0.4,1.8,1.3,1.9l4.9,0.9c0.9,0.2,1.8-0.4,1.9-1.4l0,0c0.2-0.9-0.4-1.8-1.3-1.9
				l-4.9-0.9C208.7,226.2,207.9,226.8,207.7,227.8L207.7,227.8z"
          />
        </g>
      </>
    ),
  },
];

const faceColors = ['#FFF', '#EEE', '#AAA', '#f7a584', '#f7b1ad', '#f18c80', '#e87f72', '#f58f63', '#e36a41', '#ba4a27', '#666', '#333'];
const hairColors = ['#282828', '#f0ca4a', '#ffffff', '#b8bec2', '#0b2c48', '#ea8723', '#e83837', '#833b23', '#ba4a27'];

const facialHairs = [
  {
    cx: 0,
    cy: 0,
    tag: () => {
      return <></>;
    },
  },
  {
    cx: 39.9,
    cy: 153,

    tag: (facialHairColor = '#f7a584') => {
      return (
        <>
          <ellipse
            style={{
              fill: facialHairColor,
            }}
            cx="89.8"
            cy="211.2"
            rx="11.6"
            ry="5.7"
          />
          <path
            style={{
              fill: facialHairColor,
            }}
            d="M108.7,196.5c-3.4,7.3-10.6,12.3-18.9,12.3c-8.3,0-15.5-5-18.9-12.3h-2.1v2.5c0,12.1,9.4,21.8,21,21.8
		c11.6,0,21-9.8,21-21.8v-2.5H108.7z"
          />
        </>
      );
    },
  },

  {
    cx: 95,
    cy: 158,

    tag: (facialHairColor = '#f7a584') => {
      return (
        <>
          <path
            style={{
              fill: facialHairColor,
            }}
            d="M166.8,200.6v-15.2h-3.4v21.3c-2.1,1.9-4.9,3.1-8,3.1h-19.2c-3.1,0-5.9-1.2-8-3.1v-22.2h-3.4v16.1c0,0,0,0,0,0
	v14.5c0,6.1,5.1,11,11.4,11h19.2c6.3,0,11.4-4.9,11.4-11L166.8,200.6C166.8,200.6,166.8,200.6,166.8,200.6z"
          />
        </>
      );
    },
  },
  {
    cx: 153.2,
    cy: 148.5,

    tag: (facialHairColor = '#f7a584') => {
      return (
        <>
          <g>
            <polygon
              style={{
                fill: facialHairColor,
              }}
              points="203.3,202.8 193.5,202.8 203.3,199.3 	"
            />
            <polygon
              style={{
                fill: facialHairColor,
              }}
              points="204.1,202.8 213.9,202.8 204.1,199.3 	"
            />
          </g>
          <path
            style={{
              fill: facialHairColor,
            }}
            d="M203.7,212.1c-3.3,0-6.1-1.1-7.7-2.8c-0.8,0.9-1.3,1.9-1.3,3c0,3.2,4,5.8,9,5.8s9-2.6,9-5.8
	c0-1.1-0.5-2.1-1.3-3C209.8,211,207,212.1,203.7,212.1z"
          />
        </>
      );
    },
  },
];

const tabs = [
  {
    key: 'BG',
    name: '배경',
  },
  {
    key: 'FORM',
    name: '얼굴',
  },
  {
    key: 'SKIN',
    name: '피부',
  },
  {
    key: 'CLOTH',
    name: '의상',
  },
  {
    key: 'FACE',
    name: '모양',
  },
  {
    key: 'HAIR',
    name: '헤어스타일',
  },
  {
    key: 'HAIR_COLOR',
    name: '염색',
  },
  {
    key: 'FACIAL_HAIR',
    name: '액서사리',
  },
];

class AvatarBuilder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      style: this.getDefaultStyle(),
      tab: 'BG',
      id: new Date().getTime(),
    };
  }

  componentDidMount() {
    ReactTooltip.rebuild();
  }

  onChange = (field, val) => {
    const { onChange } = this.props;
    const info = { ...this.state };
    info.style[field] = val;
    this.setState(info);
    if (onChange) onChange(JSON.stringify(info.style));
  };

  static getDerivedStateFromProps(props) {
    if (props.info) {
      try {
        const info = JSON.parse(props.info);
        return {
          style: info,
        };
      } catch {
        return null;
      }
    }

    return null;
  }

  getRandomIndex = (list) => {
    return Math.floor(Math.random() * list.length);
  };

  getDefaultStyle = () => {
    return {
      bgStyleNumber: 2,
      formNumber: 3,
      hairNumber: 1,
      faceNumber: 1,
      facialHairNumber: 0,
      faceColorNumber: 1,
      hairColorNumber: 0,
      clothColorNumber: 1,

    };
  };

  getRandomStyle = () => {
    return {
      bgStyleNumber: this.getRandomIndex(bgColors),
      formNumber: this.getRandomIndex(forms),
      hairNumber: this.getRandomIndex(hairs),
      faceNumber: this.getRandomIndex(faces),
      facialHairNumber: this.getRandomIndex(facialHairs),
      faceColorNumber: this.getRandomIndex(faceColors),
      hairColorNumber: this.getRandomIndex(hairColors),
      clothColorNumber: this.getRandomIndex(clothColors),

    };
  };

  getColorControl = (label, list, selectedIndex, fieldName) => {
    return (
      <>
        <div className="arrow-btn">
          <span
            onClick={() => {
              let nextNumber = selectedIndex - 1;
              if (nextNumber < 0) {
                nextNumber = list.length - 1;
              }

              this.onChange(fieldName, nextNumber);
            }}
          >
            <i className="fal fa-chevron-left" />
          </span>
        </div>
        <div className="picker-content color-picker scrollbar">
          {list.map((color, i) => {
            return (
              <span
                key={i}
                className={`picker-item ${selectedIndex === i ? 'selected' : ''}`}
                onClick={() => {
                  this.onChange(fieldName, i);
                }}
                style={{
                  backgroundColor: color,
                }}
              />
            );
          })}
        </div>
        <div className="arrow-btn">
          <span
            onClick={() => {
              let nextNumber = selectedIndex + 1;
              if (nextNumber > list.length - 1) {
                nextNumber = 0;
              }

              this.onChange(fieldName, nextNumber);
            }}
          >
            <i className="fal fa-chevron-right" />
          </span>
        </div>
      </>
    );
  };

  getHair = (shape, color) => {
    return (
      <>
        {this.getBackHair(shape, color)}
        {this.getFrontHair(shape, color)}
      </>
    );
  };

  getBackHair = (shape, color) => {
    return (
      <g className="back-hair" /* 얼굴 뒤 머리 */ transform={`translate(-${shape.cx}, -${shape.cy})`}>
        {shape.backTag(color)}
      </g>
    );
  };

  getFrontHair = (shape, color) => {
    return (
      <g className="front-hair" /* 얼굴 앞 머리 */ transform={`translate(-${shape.cx}, -${shape.cy})`}>
        {shape.foreTag(color)}
      </g>
    );
  };

  getFace = (shape) => {
    return (
      <g className="face" /* 얼굴  */ transform={`translate(-${shape.cx}, -${shape.cy})`}>
        {shape.tag}
      </g>
    );
  };

  getFacialHair = (shape, color) => {
    return (
      <g className="facial-hair" /* 수염  */ transform={`translate(-${shape.cx}, -${shape.cy})`}>
        {shape.tag(color)}
      </g>
    );
  };

  getForm = (shape, color, clothColor, key) => {
    const { id } = this.state;

    const darkenColor = Color(color)
      .darken(0.07)
      .hex();

    return (
      <g /* 형태 */ className="face-form" transform={`translate(-${shape.cx - 50}, -${shape.cy - 50})`}>
        <defs>
          <ellipse id={`CLIP_DEF_ID_${id}_${key}`} cx={shape.cx} cy={shape.cy} rx="50" ry="50" />
        </defs>
        <clipPath id={`CLIP_PATH_ID_${id}_${key}`}>
          <use xlinkHref={`#CLIP_DEF_ID_${id}_${key}`} style={{ overflow: 'visible' }} />
        </clipPath>

        <g
          style={{
            clipPath: `url(#CLIP_PATH_ID_${id}_${key})`,
          }}
        >
          {shape.tag(color, darkenColor, clothColor)}
        </g>
      </g>
    );
  };

  getIndex = (i) => {
    return i;
  };

  getShapeControl = (label, list, selectedIndex, fieldName, getShapeFunction, bgColor) => {
    return (
      <>
        <div className="arrow-btn">
          <span
            onClick={() => {
              let nextNumber = selectedIndex - 1;
              if (nextNumber < 0) {
                nextNumber = list.length - 1;
              }

              this.onChange(fieldName, nextNumber);
            }}
          >
            <i className="fal fa-chevron-left" />
          </span>
        </div>
        <div className="picker-content shape-picker scrollbar">
          {list.map((shape, i) => {
            return (
              <span
                key={i}
                className={`picker-item ${selectedIndex === i ? 'selected' : ''}`}
                onClick={() => {
                  this.onChange(fieldName, i);
                }}
                style={{
                  backgroundColor: bgColor,
                }}
              >
                <svg viewBox="0 0 100 100">{getShapeFunction(shape, '#CCC', '#EEE', i)}</svg>
              </span>
            );
          })}
        </div>
        <div className="arrow-btn">
          <span
            onClick={() => {
              let nextNumber = selectedIndex + 1;
              if (nextNumber > list.length - 1) {
                nextNumber = 0;
              }
              this.onChange(fieldName, nextNumber);
            }}
          >
            <i className="fal fa-chevron-right" />
          </span>
        </div>
      </>
    );
  };

  changeTab = (tab) => {
    this.setState({
      tab,
    });
  };

  render() {
    const { style, tab } = this.state;
    const {
      bgStyleNumber,
      formNumber,
      hairNumber,
      faceNumber,
      facialHairNumber,
      faceColorNumber,
      hairColorNumber,
      clothColorNumber,

    } = style;

    const { onChange, className } = this.props;

    return (
      <article className={`avatar-builder g-no-select ${className}`}>
        <div className="preview-box">
          <div
            className="preview-image"
          >
            <svg viewBox="0 0 100 100">
              <g /* 배경 원 */>
                <ellipse
                  cx="50"
                  cy="50"
                  rx="50"
                  ry="50"
                  style={{
                    fill: bgColors[bgStyleNumber],
                  }}
                />
              </g>
              {this.getBackHair(hairs[hairNumber], hairColors[hairColorNumber])}
              {this.getForm(forms[formNumber], faceColors[faceColorNumber], clothColors[clothColorNumber], 'preview')}
              {this.getFacialHair(facialHairs[facialHairNumber], hairColors[hairColorNumber])}
              {this.getFace(faces[faceNumber])}
              {this.getFrontHair(hairs[hairNumber], hairColors[hairColorNumber])}
            </svg>
          </div>
          <div className="random-button d-none">
            <CircleIcon
              className=""
              icon={<i className="fal fa-transporter" />}
              onClick={() => {
                if (onChange) onChange(JSON.stringify(this.getRandomStyle()));
              }}
            />
          </div>
        </div>
        <div className="controller">
          <Card className="g-border-normal">
            <CardHeader className="g-border-normal p-0">
              <Nav className="tabs" tabs>
                {tabs.map((t) => {
                  return (
                    <NavItem
                      key={t.key}
                      className={tab === t.key ? 'focus' : ''}
                      onClick={() => {
                        this.changeTab(t.key);
                      }}
                    >
                      {t.name}
                    </NavItem>
                  );
                })}
              </Nav>
            </CardHeader>
            <CardBody className="bg-gray p-0">
              {tab === 'BG' && (
                <div className="control-box">
                  {this.getColorControl('배경 색상', bgColors, bgStyleNumber, 'bgStyleNumber')}
                </div>
              )}
              {tab === 'FORM' && (
                <div className="control-box">
                  {this.getShapeControl(
                    '얼굴 형태',
                    forms,
                    formNumber,
                    'formNumber',
                    this.getForm,
                    bgColors[bgStyleNumber],
                  )}
                </div>
              )}
              {tab === 'CLOTH' && (
                <div className="control-box">
                  {this.getColorControl('의상', clothColors, clothColorNumber, 'clothColorNumber')}
                </div>
              )}
              {tab === 'FACE' && (
                <div className="control-box">
                  {this.getShapeControl('눈코입', faces, faceNumber, 'faceNumber', this.getFace)}
                </div>
              )}
              {tab === 'SKIN' && (
                <div className="control-box">
                  {this.getColorControl('피부', faceColors, faceColorNumber, 'faceColorNumber')}
                </div>
              )}
              {tab === 'HAIR' && (
                <div className="control-box">
                  {this.getShapeControl('헤어스타일', hairs, hairNumber, 'hairNumber', this.getHair)}
                </div>
              )}
              {tab === 'HAIR_COLOR' && (
                <div className="control-box">
                  {this.getColorControl('머리 색상', hairColors, hairColorNumber, 'hairColorNumber')}
                </div>
              )}
              {tab === 'FACIAL_HAIR' && (
                <div className="control-box">
                  {this.getShapeControl('수염', facialHairs, facialHairNumber, 'facialHairNumber', this.getFacialHair)}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </article>
    );
  }
}
export default AvatarBuilder;

AvatarBuilder.propTypes = {
  onChange: PropTypes.func,
  info: PropTypes.shape(PropTypes.any),
  className: PropTypes.string,
};
