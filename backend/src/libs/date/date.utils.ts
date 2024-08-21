import * as moment from 'moment';

export let dateUtils: DateUtils

export class DateUtils {
  static createInstance(tz: string) {
    if (!dateUtils || (dateUtils && dateUtils.tz !== tz)) {
      dateUtils = new DateUtils(tz);
    }
  }

  static get localTimestampOffset() {
    const value = moment().utcOffset();
    const { length } = String(value);

    if (value === 0) return '0000';

    if (value > 0) {
      return length === 3 ? `+0${value}` : '+' + value;
    } else {
      return length === 3 ? `-0${value}` : '-' + value;
    }
  }

  private constructor(readonly tz: string) {}

  /**
   * @param utc default = true
   */
  now(utc = true) {
    if (utc) {
      return moment().utcOffset(this.tz);
    }
    return moment().utc();
  }

  randomDate() {
    const now = moment().utc();
    const tomorrow = now.clone().utc().add(1, 'day');
    const randomTimestamp =
      moment().utc().valueOf() +
      Math.random() * (tomorrow.valueOf() - now.valueOf());
    return moment.unix(randomTimestamp).utcOffset(this.tz).toDate();
  }

  /**
   * @param utc default = true
   */
  randomDateBetween(start: moment.Moment, end: moment.Moment, utc = true) {
    const startDate = start.startOf('day');
    const endDate = end.endOf('day');
    const randomTimestamp =
      Math.random() * (endDate.valueOf() - startDate.valueOf()) +
      startDate.valueOf();
    if (utc) {
      return moment(randomTimestamp).utc().valueOf();
    }
    return moment(randomTimestamp).utcOffset(this.tz).valueOf();
  }

  move(
    baseDate: moment.Moment,
    type: 'subtract' | 'add',
    amount?: moment.DurationInputArg1,
    unit?: moment.DurationInputArg2,
    utc = true,

  ) {
    if(utc) {
    return baseDate.clone().utc()[type](amount, unit);

    }
    return baseDate.clone().utcOffset(this.tz)[type](amount, unit);
  }

  timestamp(date?: Date) {
    return date && date.getTime();
  }

  tsToUtcDate(timestamp?: number) {
    return timestamp ? moment(timestamp).utc().toDate() : undefined;
  }

  startOf(
    relatedDate: moment.Moment,
    unitOfTime: moment.unitOfTime.StartOf,
    utc = true,
  ) {
    if (utc) {
      return relatedDate.clone().utc().startOf(unitOfTime);
    }
    return relatedDate.clone().utcOffset(this.tz).startOf(unitOfTime);
  }

  date(date: number| Date, utc = true){
    return utc ?moment(date).utc(): moment(date)
  }

  endOf(
    relatedDate: moment.Moment,
    unitOfTime: moment.unitOfTime.StartOf,
    utc = true,
  ) {
    if (utc) {
      return relatedDate.clone().utc().endOf(unitOfTime);
    }
    return relatedDate.clone().utcOffset(this.tz).endOf(unitOfTime);
  }
}
