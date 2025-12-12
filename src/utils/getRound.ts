import moment from 'moment';

const CONST_ROUND = {
  round: 1009,
  date: moment('2022-04-02'),
};

export const getRound = (date: moment.Moment) => {
  return Math.floor(1009 + date.diff(CONST_ROUND.date, 'days') / 7);
};
