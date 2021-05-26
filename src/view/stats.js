import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import SmartView from './smart.js';

import {StatsFilter} from '../const.js';
import {getRank, getTotalDuration, getGenresStats, getTopGenre, filterByDate} from '../utils/common.js';

const renderStatisticsChart = (films, statisticsCtx) => {
  const BAR_HEIGHT = 50;

  const genresNames = [];
  const genresCounts = [];

  Object
    .entries(getGenresStats(films))
    .sort((a, b) => b[1] - a[1])
    .forEach(([name, count]) => {
      genresNames.push(name);
      genresCounts.push(count);
    });

  statisticsCtx.height = BAR_HEIGHT * Object.values(genresNames).length;

  return new Chart(statisticsCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genresNames,
      datasets: [{
        data: genresCounts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        dataset: [{
          barThickness: 24,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = (films, currentFilter) => {
  const history = films.filter((film) => film.isWatched);

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getRank(films) === '' ? ' ' : getRank(films)}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${currentFilter === StatsFilter.ALL_TIME ? 'checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${currentFilter === StatsFilter.TODAY ? 'checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${currentFilter === StatsFilter.WEEK ? 'checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${currentFilter === StatsFilter.MONTH ? 'checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${currentFilter === StatsFilter.YEAR ? 'checked' : ''}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${history.length}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${getTotalDuration(films).HOURS} <span class="statistic__item-description">h</span> ${getTotalDuration(films).MINUTES} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${getTopGenre(films)}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>`;

};

class Stats extends SmartView {
  constructor(films) {
    super();

    this._films = films;
    this._watchedFilms = films.filter((film) => film.isWatched);
    this._data = {
      films: this._watchedFilms,
      currentStatisticsFilter: StatsFilter.ALL_TIME,
    };

    this._chart = null;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._setChart();
    this._setFilterChangeHandler();
  }

  getTemplate() {
    return createStatisticsTemplate(this._data.films, this._data.currentStatisticsFilter);
  }

  removeElement() {
    super.removeElement();
    if (this._chart !== null) {
      this._chart = null;
    }
  }

  restoreHandlers() {
    this._setFilterChangeHandler();
    this._setChart();
  }

  _filterChangeHandler(evt) {
    evt.preventDefault();

    const newFilter = evt.target.value;

    switch (newFilter) {
      case StatsFilter.ALL_TIME:
        this.updateData({
          films: this._watchedFilms,
          currentStatisticsFilter: StatsFilter.ALL_TIME,
        });
        break;

      case StatsFilter.TODAY:
        this.updateData({
          films: filterByDate(this._watchedFilms, StatsFilter.TODAY),
          currentStatisticsFilter: StatsFilter.TODAY,
        });
        break;
      case StatsFilter.WEEK:
        this.updateData({
          films: filterByDate(this._watchedFilms, StatsFilter.WEEK),
          currentStatisticsFilter: StatsFilter.WEEK,
        });
        break;
      case StatsFilter.MONTH:
        this.updateData({
          films: filterByDate(this._watchedFilms, StatsFilter.MONTH),
          currentStatisticsFilter: StatsFilter.MONTH,
        });
        break;
      case StatsFilter.YEAR:
        this.updateData({
          films: filterByDate(this._watchedFilms, StatsFilter.YEAR),
          currentStatisticsFilter: StatsFilter.YEAR,
        });
        break;
    }

    this.getElement().scrollIntoView();
  }

  _setFilterChangeHandler() {
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._filterChangeHandler);
  }

  _setChart() {
    if (this._chart !== null) {
      this._chart = null;
    }

    const statisticsCtx = this.getElement().querySelector('.statistic__chart');

    this._chart = renderStatisticsChart(this._data.films, statisticsCtx);
  }
}

export {Stats as default};
