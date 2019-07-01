/**
 *台风等级
 *
 * @enum {number}
 */
enum TyphoonLevel {
  /**
   * 热带低压
   */
  td = 1,
  /**
   *热带风暴
   */
  ts = 2,
  /**
   *强热带风暴
   */
  sts = 3,
  /**
   *台风
   */
  ty = 4,
  /**
   *强台风
   */
  sty = 5,
  /**
   *超强台风
   */
  superty = 6
}

export { TyphoonLevel };
