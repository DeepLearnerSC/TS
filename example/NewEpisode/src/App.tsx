import React from "react";
import { Store } from "./store";
import { IAction, IEpisode } from "./interfaces";

const EpisodeList = React.lazy<any>(()=> import ('./EpisodeList' ));


export default function App(): JSX.Element {
  const { state, dispatch } = React.useContext(Store);

  React.useEffect(() => {
    state.episodes.length === 0 && fetchDataAction();
  });

  const fetchDataAction = async () => {
    const URL =
      "https://api.tvmaze.com/singlesearch/shows?q=rick-&-morty&embed=episodes";
    const data = await fetch(URL);
    const dataJSON = await data.json();
    return dispatch({
      type: "FETCH_DATA",
      payload: dataJSON._embedded.episodes
    });
  };
  const toggleFavAction = (episode: IEpisode): IAction => {
    const episodeInFav = state.favorites.includes(episode);
    let dispatchObj = {
      type: "ADD_FAV",
      payload: episode
    };
    if (episodeInFav) {
      const favWithoutEpisode = state.favorites.filter(
        (fav: IEpisode) => fav.id !== episode.id
      );
      dispatchObj = {
        type: "REMOVE_FAV",
        payload: favWithoutEpisode
      };
    }

    return dispatch(dispatchObj);
  };

  const props = {
    episodes: state.episodes,
    toggleFavAction,
    favorites: state.favorites
  }
  console.log(state);
  return (
    <React.Fragment>
      <header className="header">
        <div>
          <h1>Fire and Ice</h1>
          <p>Pick your favorite Episode!!</p>
        </div>
        <div>favorite(s):{state.favorites.length}</div>
      </header>
      <React.Suspense fallback={<div>...loading</div>} >
        <section className="episode-layout">
          <EpisodeList {...props}/>>
        </section>
      </React.Suspense>
    </React.Fragment>
  );
}
