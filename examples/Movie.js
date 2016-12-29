import React from 'react'
import fetch from 'isomorphic-fetch'
import { style } from 'glamor'

export default class Movie extends React.Component {
  static getInitialProps ({query, params}) {
    return fetch(`http://www.omdbapi.com/?i=${query.id || 'tt0084726'}`)
      .then(x => x.json())
      .then(x => ({item: x}))
  }

  render () {
    return (
      <div className={style(styles.main)}>
        <div className={style(styles.header)}>
          <h3>OMDB API - STAR TREK MOVIES</h3>
        </div>
        <div className={style(styles.singlePhoto)}>
          <img src={ this.props.item.Poster} alt={this.props.item.Title} width={100} height={100} />
        </div>
        <div className={style(styles.panel)}>
          <h1 className={style(styles.heading)}>
            { this.props.item.Title }
            <br/>
            <br/>
            Year: { this.props.item.Year }
            <br/>
            <br/>
            Plot:
            <span> { this.props.item.Plot } </span>
          </h1>
        </div>
      </div>
    )
  }
}


const styles = {
  main: {
    padding: '50px'
  },

  header: {
    fontSize: '15px',
    fontFamily: 'Arial',
    textAlign: 'center'
  },

  panel: {
    marginRight: '140px',
    width: '300px'
  },

  singlePhoto: {
    border: '1px solid #999',
    width: '100px',
    height: '100px',
  },

  heading: {
    font: '15px Arial'
  }
}
