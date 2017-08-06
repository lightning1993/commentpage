import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import CommentList from '../components/CommentList.js'
import { initComments, deleteComment } from '../actions/actionCreators.js'

// CommentListContainer Smart组件 
// 负责评论列表数据的加载、初始化、删除评论
// 需要给CommentList传入onDeleteComment、comments参数

class CommentListContainer extends Component {
    static propTypes = {
        comments: PropTypes.array,
        initComments: PropTypes.func,
        onDeleteComment: PropTypes.func
    }

    componentWillMount() {
        this._loadComments()
    }

    _loadComments() {
        //需要从localStorage加载评论
        let comments = localStorage.getItem('comments')
        comments = comments ? JSON.parse(comments) : []
        //将数据初始化到state中去
        this.props.initComments(comments)
    }

    handleDeleteComponent(index) {
        const {comments} = this.props
        // props 是不能变的，所以这里新建一个删除了特定下标的评论列表
        const newComments = [
            ...comments.slice(0, index),
            ...comments.slice(index + 1)
        ]
        //将更新后的comments保存到localstorage
        localStorage.setItem('comments', JSON.stringify(newComments))
        //更新redux中comments
        if (this.props.onDeleteComment) {
            this.props.onDeleteComment(index)
        }
    }
    render() {
        return (
            <CommentList
            comments={this.props.comments}
            onDeleteComment={this.handleDeleteComponent.bind(this)} />
        )
    }
}

//从redux中获取comments
function mapStateToProps(state) {
    return {
        comments: state.comments
    }
}

function mapDispatchToProps(dispatch) {
    return {
        initComments: (comments) => {
            dispatch(initComments(comments))
        },

        onDeleteComment: (commentIndex) => {
            dispatch(deleteComment(commentIndex))
        }
    }
}


// 将 CommentListContainer connect 到 store
// 将 comments、initComments、onDeleteComment 传给 CommentListContainer
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommentListContainer)

