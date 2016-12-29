import React from 'react'
import { Link } from 'react-router'
import { style } from 'glamor'
import fetch from 'isomorphic-fetch'

export default class extends React.Component {
  static getInitialProps () {
    return fetch('http://www.omdbapi.com/?s=Star%20Trek&type=movie')
      .then(x => x.json())
      .then(x => ({movies: x.Search}))
  }

  render () {
    return (
      <div>
        <div className={style(styles.header)}>
          <h3>OMDB API - STAR TREK MOVIES</h3>
        </div>
        <table className={style(styles.table)}>
          <thead>
            <tr>
              <th className={style(styles.th)}>Year</th>
              <th className={style(styles.th)}>Title</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.movies.map((movie, i) => (
                <tr key={i}>
                  <td className={style(styles.td)}>{ movie.Year }</td>
                  <td className={style(styles.td)}>
                    <a href={`/movie?id=${movie.imdbID}`}>{ movie.Title }</a>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    )
  }
}

const styles = {
  th: {
    background: '#00cccc',
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: '12px',
    padding: '12px 35px',
  },

  header: {
    fontSize: '15px',
    fontFamily: 'Arial',
    textAlign: 'center'
  },

  table: {
    fontFamily: 'Arial',
    margin: '25px auto',
    borderCollapse: 'collapse',
    border: '1px solid #eee',
    borderBottom: '2px solid #00cccc'
  },

  td: {
    color: '#999',
    border: '1px solid #eee',
    padding: '12px 35px',
    borderCollapse: 'collapse'
  },

  list: {
    padding: '50px',
    textAlign: 'center'
  },

  photo: {
    display: 'inline-block'
  },

  photoLink: {
    color: '#333',
    verticalAlign: 'middle',
    cursor: 'pointer',
    background: '#eee',
    display: 'inline-block',
    width: '250px',
    height: '250px',
    lineHeight: '250px',
    margin: '10px',
    border: '2px solid transparent',
    ':hover': {
      borderColor: 'blue'
    }
  }
}
