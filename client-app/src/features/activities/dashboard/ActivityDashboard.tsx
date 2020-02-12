import React, { useContext, useEffect, useState } from 'react';
import { Grid, Button, Loader } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityFilters from './ActivityFilters';

const ActivityDashboard = () => {

   const rootStore = useContext(RootStoreContext);
   const { loadActivities, loadingInitial, setPage, page, totalPages } = rootStore.activityStore;

   const [isLoadingNext, setIsLoadingNext] = useState(false);

   const handleGetNext = () => {
      setIsLoadingNext(true);
      setPage(page + 1);
      loadActivities().then(() => setIsLoadingNext(false));
   }

   useEffect(() => {
      loadActivities();
   },
      [loadActivities]);

   if (loadingInitial && page === 0) return <LoadingComponent content='Loading activities...' />


   return (
      <Grid>
         <Grid.Column width={10}>
            <InfiniteScroll 
               pageStart={0}
               loadMore={handleGetNext}
               hasMore={!isLoadingNext && page + 1 < totalPages }
               initialLoad={false}
               >
               <ActivityList />
            </InfiniteScroll>
         </Grid.Column>
         <Grid.Column width={6}>
            <ActivityFilters />
         </Grid.Column>
         <Grid.Column width={10}>
            <Loader active={isLoadingNext} />
         </Grid.Column>
      </Grid>
   )
}

export default observer(ActivityDashboard);
