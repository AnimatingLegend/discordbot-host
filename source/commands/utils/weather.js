const {
     axios,
     colors,
     fetchWeatherApi,
     SlashCommandBuilder, EmbedBuilder,
     logger
} = require('../../libs.js');

const { WeatherLog } = require('../../utils/logging/commands/WeatherLog.js');

module.exports = {
     data: new SlashCommandBuilder()
          .setName('weather')
          .setDescription('Get the current weather in your area.')
          .addStringOption(option =>
               option.setName('location')
                    .setDescription('The location to get the weather for (e.g. London, Tokyo, etc.')
                    .setRequired(true)
          ),

     name: 'weather',
     description: 'Get the current weather in your area.',

     async execute(ctx, args) {
          const location_query = ctx.options?.getString('location') || args.join(' ');

          await ctx.reply({ content: ':mag_right: Fetching weather data...', ephemeral: true });

          try {
               const URL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location_query)}&count=1&language=en&format=json`;
               const GEO_RESPONSE = await axios.get(URL);

               if (!GEO_RESPONSE.data.results || GEO_RESPONSE.data.results.length === 0)
                    return ctx.reply({ content: `[:x:] No results found for \`${location_query}\``, ephemeral: true });

               const { latitude, longitude, name, country, timezone } = GEO_RESPONSE.data.results[0];

               const weather_url = `https://api.open-meteo.com/v1/forecast`;
               const params = {
                    latitude: latitude,
                    longitude: longitude,
                    current: ["temperature_2m", "relative_humidity_2m", "weather_code", "wind_speed_10m"],
                    timezone: timezone
               };

               const responses = await fetchWeatherApi(weather_url, params);

               if (!responses || responses.length === 0)
                    throw new Error('[API ERROR] API returned empty. Do data array was found.');

               const response = responses[0];
               const current = response.current();

               if (!current)
                    throw new Error('[ERROR] No Weather Data Found.')

               const temp = current.variables(0).value();
               const humidity = current.variables(1).value();
               const wind_speed = current.variables(3).value();

               const embed = new EmbedBuilder()
                    .setColor(colors.resolve(colors.static('Default')))
                    .setTitle(`:cloud_rain: Weather in ${name}, ${country} :cloud_rain:`)
                    .setDescription(`Coords: \`${latitude.toFixed(2)}, ${longitude.toFixed(2)}\``)
                    .addFields(
                         { name: ':thermometer:Temperature', value: `${temp.toFixed(1)}°C`, inline: true },
                         { name: ':droplet: Humidity', value: `${humidity} %`, inline: true },
                         { name: ':dash: Wind Speed', value: `${wind_speed.toFixed(1)} m/s`, inline: true }
                    )
                    .setTimestamp()

               WeatherLog(name, country, latitude, longitude, timezone);

               await ctx.reply({ content: null, embeds: [embed] });

          } catch (err) {
               logger.error(`[WEATHER]: ${err}`);
               await ctx.reply({ content: `[:x:] An error occurred while fetching weather data.`, ephemeral: true });
          }
     }
};