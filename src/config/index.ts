interface Config {
  appName: string;
  settings: {
    version: string;
    port: number;
    debug: boolean;
  };
}

const config: Config = {
  appName: 'NodeJsPractice',
  settings: {
    version: '1.0.0',
    port: 3000,
    debug: true
  }
};

module.exports = config;