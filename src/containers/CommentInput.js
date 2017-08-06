import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import CommentInput from '../components/CommentInput.js'
import { addComment } from '../actions/actionCreators.js'

// CommentInputContainer Smart组件
// 负责用户名的加载、保存，评论的发布
// 需要给CommentInput传入username、onSubmit、onUserNameInputBlur

class CommentInputContainer extends Component {
    static propTypes = {
        comments: PropTypes.any,
        onSubmit: PropTypes.func
    }

    constructor() {
        super()
        this.state = {
            username: ''
        }
    }

    componentWillMount() {
        //初始化用户名
        this._loadUsername()
    }

    _loadUsername() {
        const username = localStorage.getItem('username')
        if (username) {
            this.setState({
                username
            })
        }
    }

    _saveUsername(username) {
        localStorage.setItem('username', username)
    }

    handleSubmitComment(comment) {
        //提交comments前验证
        if (!comment) {
            return
        }
        if (!comment.username) {
            return alert('请输入用户名')
        }
        if (!comment.content) {
            return alert('请输入评论内容')
        }
        //将新增评论更新到localstorage中
        const newComments = [...this.props.comments, comment]
        localStorage.setItem('comments', JSON.stringify(newComments))
        //新增评论到redux中
        if (this.props.onSubmit) {
            this.props.onSubmit(comment)
        }

    }


    render() {
        return (
            <CommentInput
            username={this.state.username}
            onUserNameInputBlur={this._saveUsername.bind(this)}
            onSubmit={this.handleSubmitComment.bind(this)}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        comments: state.comments
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onSubmit: (comment) => {
            dispatch(addComment(comment))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommentInputContainer)