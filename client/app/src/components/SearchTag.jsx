import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { searchCardsAction } from '../actions/cardActions';
import { removeCardFilterAction, searchCardsAction } from '../actions/cardActions';
import { deleteSearchTagAction } from '../actions/searchActions';

class SearchTag extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="chip">
        {this.props.name}
        <i className="material-icons" onClick={() => {
          console.log('SEARCH STATE? ', this.props.search)

          let searchString = this.props.search.input.split(' ').filter(tag =>
            tag !== this.props.name
          ).join(' ');
          this.props.removeCardFilter(searchString);
          this.props.deleteSearchTag(this.props.name);
        }}>
          close
        </i>
      </div>
    ); 
  }
};
            // let searchString = this.props.search.input.split(' ').filter((tag) => 
            //   return tag !== this.props.name
            // ).join(' ');

// const searchInput = [];
// this.props.search.input.split(' ').forEach(tag => {
//   if (tag !== this.props.name) {
//     searchInput.push(tag);
//   }
// });
// let searchString = '';
// if (searchInput) {
//   searchInput.forEach(tag => {
//     searchString = searchString.concat(' ', tag)
//   });
// }

const mapStateToProps = (state) => {
  return {
    search: state.search,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    searchCards: searchCardsAction,
    deleteSearchTag: deleteSearchTagAction,
    removeCardFilter: removeCardFilterAction,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchTag);
