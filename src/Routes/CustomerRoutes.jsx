import React from 'react';
import { Route, Switch } from 'react-router-dom';
import requireCustAuth from '../Utils/requireCustAuth';

import MyAccount from '../Components/PublicSite/Account/MyAccount';

const CustomerRoutes = () => {
    return (
        <Switch>
            <Route path='/my-account' component={requireCustAuth(MyAccount)} exact strict />
            <Route path='/my-account/' component={requireCustAuth(MyAccount)} exact strict />
        </Switch>
    );
};

export default CustomerRoutes;