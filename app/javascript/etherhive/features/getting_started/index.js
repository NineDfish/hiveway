import React from 'react';
import Column from '../ui/components/column';
import ColumnLink from '../ui/components/column_link';
import ColumnSubheading from '../ui/components/column_subheading';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { me } from '../../initial_state';
import { fetchFollowRequests } from '../../actions/accounts';
import { List as ImmutableList } from 'immutable';

const messages = defineMessages({
  heading: { id: 'getting_started.heading', defaultMessage: 'Getting started' },
  home_timeline: { id: 'tabs_bar.home', defaultMessage: 'Home' },
  notifications: { id: 'tabs_bar.notifications', defaultMessage: 'Notifications' },
  public_timeline: { id: 'navigation_bar.public_timeline', defaultMessage: 'Federated timeline' },
  navigation_subheading: { id: 'column_subheading.navigation', defaultMessage: 'Navigation' },
  settings_subheading: { id: 'column_subheading.settings', defaultMessage: 'Settings' },
  community_timeline: { id: 'navigation_bar.community_timeline', defaultMessage: 'Local timeline' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  follow_requests: { id: 'navigation_bar.follow_requests', defaultMessage: 'Follow requests' },
  sign_out: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
  favourites: { id: 'navigation_bar.favourites', defaultMessage: 'Favourites' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
  info: { id: 'navigation_bar.info', defaultMessage: 'Extended information' },
  pins: { id: 'navigation_bar.pins', defaultMessage: 'Pinned posts' },
  lists: { id: 'navigation_bar.lists', defaultMessage: 'Lists' },
  keyboard_shortcuts: { id: 'navigation_bar.keyboard_shortcuts', defaultMessage: 'Keyboard shortcuts' },
});

const mapStateToProps = state => ({
  myAccount: state.getIn(['accounts', me]),
  columns: state.getIn(['settings', 'columns']),
  unreadFollowRequests: state.getIn(['user_lists', 'follow_requests', 'items'], ImmutableList()).size,
  unreadNotifications: state.getIn(['notifications', 'unread']),
});

const mapDispatchToProps = dispatch => ({
  fetchFollowRequests: () => dispatch(fetchFollowRequests()),
});

const badgeDisplay = (number, limit) => {
  if (number === 0) {
    return undefined;
  } else if (limit && number >= limit) {
    return `${limit}+`;
  } else {
    return number;
  }
};

@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
export default class GettingStarted extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    myAccount: ImmutablePropTypes.map.isRequired,
    columns: ImmutablePropTypes.list,
    multiColumn: PropTypes.bool,
    fetchFollowRequests: PropTypes.func.isRequired,
    unreadFollowRequests: PropTypes.number,
    unreadNotifications: PropTypes.number,
  };

  componentDidMount () {
    const { myAccount, fetchFollowRequests } = this.props;

    if (myAccount.get('locked')) {
      fetchFollowRequests();
    }
  }

  render () {
    const { intl, myAccount, columns, multiColumn, unreadFollowRequests, unreadNotifications } = this.props;

    const navItems = [];

    if (multiColumn) {
      if (!columns.find(item => item.get('id') === 'HOME')) {
        navItems.push(<ColumnLink key='0' icon='home' text={intl.formatMessage(messages.home_timeline)} to='/timelines/home' />);
      }

      if (!columns.find(item => item.get('id') === 'NOTIFICATIONS')) {
        navItems.push(<ColumnLink key='1' icon='bell' text={intl.formatMessage(messages.notifications)} badge={badgeDisplay(unreadNotifications)} to='/notifications' />);
      }

      if (!columns.find(item => item.get('id') === 'COMMUNITY')) {
        navItems.push(<ColumnLink key='2' icon='users' text={intl.formatMessage(messages.community_timeline)} to='/timelines/public/local' />);
      }
    }

    navItems.push(
      <ColumnLink key='4' icon='star' text={intl.formatMessage(messages.favourites)} to='/favourites' />,
      <ColumnLink key='5' icon='bars' text={intl.formatMessage(messages.lists)} to='/lists' />
    );

    if (myAccount.get('locked')) {
      navItems.push(<ColumnLink key='6' icon='users' text={intl.formatMessage(messages.follow_requests)} badge={badgeDisplay(unreadFollowRequests, 40)} to='/follow_requests' />);
    }

    if (multiColumn) {
      navItems.push(<ColumnLink key='7' icon='question' text={intl.formatMessage(messages.keyboard_shortcuts)} to='/keyboard-shortcuts' />);
    }

    navItems.push(<ColumnLink key='8' icon='book' text={intl.formatMessage(messages.info)} href='/about/more' />);

    return (
      <Column icon='asterisk' heading={intl.formatMessage(messages.heading)} hideHeadingOnMobile>
        <div className='getting-started__wrapper'>
          <ColumnSubheading text={intl.formatMessage(messages.navigation_subheading)} />
          {navItems}
          <ColumnSubheading text={intl.formatMessage(messages.settings_subheading)} />
          <ColumnLink icon='thumb-tack' text={intl.formatMessage(messages.pins)} to='/pinned' />
          <ColumnLink icon='volume-off' text={intl.formatMessage(messages.mutes)} to='/mutes' />
          <ColumnLink icon='ban' text={intl.formatMessage(messages.blocks)} to='/blocks' />
          <ColumnLink icon='cog' text={intl.formatMessage(messages.preferences)} href='/settings/preferences' />
          <ColumnLink icon='sign-out' text={intl.formatMessage(messages.sign_out)} href='/auth/sign_out' method='delete' />
        </div>

        <div className='static-content getting-started'>
          <p>
            &nbsp;
          </p>
          <p>
            <FormattedMessage
              id='getting_started.open_source_notice'
              defaultMessage='Hiveway is open source software. You can contribute or report issues on GitHub at {github}.'
              values={{ github: <a href='https://github.com/hiveway' rel='noopener' target='_blank'>https://github.com/hiveway</a> }}
            />
          </p>
        </div>
      </Column>
    );
  }

}
