import { Logger } from '../../packages/graphony-debug/src/index';

describe('Logger', () => {
  let logger;
  beforeEach(() => {
    logger = new Logger();
  });

  it('should log info', () => {
    logger.on = true;
    logger.info('marvelous')
  });

  it('should log info', () => {
    logger.on = true;
    logger.debug('marvelous')
  });

  it('should log warn', () => {
    logger.on = true;
    logger.warn('marvelous')
  });

  it('should log error', () => {
    logger.on = true;
    logger.error('marvelous')
  });

  it('should log trace', () => {
    logger.on = true;
    logger.trace('marvelous')
  });

  it('should log count', () => {
    logger.on = true;
    logger.count('marvelous')
  });

  it('should log at a selected count level', () => {
    logger.on = true;
    logger.level = 'count';
    logger.log('marvelous')
  });

  it('should log at a selected debug level', () => {
    logger.on = true;
    logger.level = 'debug';
    logger.log('marvelous')
  });

  it('should log at a selected info level', () => {
    logger.on = true;
    logger.level = 'info';
    logger.log('marvelous')
  });

  it('should log at a selected warn level', () => {
    logger.on = true;
    logger.level = 'warn';
    logger.log('marvelous')
  });

  it('should log at a selected error level', () => {
    logger.on = true;
    logger.level = 'error';
    logger.log('marvelous')
  });

});
