import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import env from 'react-dotenv';
import axios from 'axios';

const API_KEY = env.API_KEY 

const url: string = 'https://newsapi.org/v2/everything?q=ai&pageSize=100&apiKey=' + API_KEY

export interface Iarticle {
  source: any;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: Date;
  content: string | null;
}

export interface newsState {
  articlesArray: Iarticle[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: newsState = {
  articlesArray: [],
  status: 'idle',
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const getNews = createAsyncThunk(
  'counter/fetchCount',
  async () => {
    const response = await axios.get(url);
    console.log(response.data.articles)
    let cleanArticles: Iarticle[] = []

    response.data.articles.forEach((item:Iarticle) => { 
      let dateObject = new Date(item.publishedAt)
      let dateString = dateObject.toDateString()
      let cleanArticle: Iarticle = {
        source: item.source.name,
        author: item.author,
        title: item.title,
        description: item.description,
        url: item.url,
        urlToImage: item.urlToImage,
        publishedAt: dateObject,
        content:item.content
      }
      cleanArticles.push(cleanArticle)

    })
    // The value we return becomes the `fulfilled` action payload
    
    return cleanArticles;
  }
);

export const newsSlice = createSlice({
  name: 'article',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    
    
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getNews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.status = 'idle';
        state.articlesArray = action.payload;
        return state;
      });
  },
});

//export const { increment, decrement, incrementByAmount } = newsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectNews = (state: RootState) => state.newsSlice.articlesArray;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
/* export const incrementIfOdd = (amount: number): AppThunk => (
  dispatch,
  getState
) => {
  const currentValue = selectCount(getState());
  if (currentValue % 2 === 1) {
    dispatch(incrementByAmount(amount));
  }
}; */

export default newsSlice.reducer;
