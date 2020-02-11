import React, { useContext, useEffect, useState } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';


const ActivityDashboard = () => {

   const rootStore = useContext(RootStoreContext);
   const { loadActivities, loadingInitial, setPage, page, totalPages } = rootStore.activityStore;

   const [isLoadingNext, setIsLoadingNext] = useState(false);

   const handleGetNext = () => {
      console.log(totalPages);
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
            <ActivityList />
            <Button
               floated='right'
               content='More...'
               positive
               onClick={() => handleGetNext()}
               loading={isLoadingNext}
               disabled={totalPages === page + 1}
            />
         </Grid.Column>
         <Grid.Column width={6}>
            <h2>Activity Filters</h2>
         </Grid.Column>
      </Grid>
   )
}

export default observer(ActivityDashboard);
