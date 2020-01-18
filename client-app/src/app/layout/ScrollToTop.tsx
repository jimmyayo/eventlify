import { useEffect } from "react";
import { useLocation, withRouter } from "react-router-dom";

const ScrollToTop = () => {
   const { pathname } = useLocation();

   useEffect(() => {
      window.scrollTo(0, 0);
   }, [pathname]);

   return null;
}

export default withRouter(ScrollToTop);