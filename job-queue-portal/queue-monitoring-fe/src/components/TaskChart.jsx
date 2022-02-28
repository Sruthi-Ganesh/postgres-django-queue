import { Chart, Tooltip, Axis, Legend, Pie, Coord } from 'viser-react';
import * as React from 'react';
import { useSelector } from 'react-redux'
import {TASK_TABLE_COLORS} from '../constants';

const DataSet = require('@antv/data-set');

export const TaskChart = () => {
  const originalRows = useSelector(state => state.tokenApi.tasks)
  if (!originalRows) {
    return <></>
  }
  const sourceData = TASK_TABLE_COLORS.map((taskValue) => {
    const count = originalRows.filter((row) => row.status === taskValue.value).length;
    return {item: taskValue.title, count, color: taskValue.color}
  });
    const scale = [{
      dataKey: 'percent',
      min: 0,
      formatter: '.0%',
    }];
    
    const dv = new DataSet.View().source(sourceData);
    dv.transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent'
    });
    const data = dv.rows;
  
    return (
      <Chart forceFit height={400} data={data} scale={scale}>
        <Tooltip showTitle={false} />
        <Coord type="theta" />
        <Axis />
        <Legend dataKey="item" />
        <Pie
          position="percent"
          color="item"
          style={{ stroke: '#fff', lineWidth: 1 }}
          label={['percent', {
            formatter: (val, item) => {
              return item.point.item + ': ' + val;
            }
          }]}
        />
      </Chart>
    );
}
