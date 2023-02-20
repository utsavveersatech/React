module Api
	module V1
		class CommentsController < ApplicationController

			# def show_comments
			# 	comments = Comment.where(inventory_id: params[:inventory_id])
			# 	# byebug
			# 	# reactions = comments.usercontentreactions.map{ |ucr| ucr.reaction.id}
			# 	render json: {comments: comments}
			# end

			def show_comments
				comments = Comment.where(inventory_id: params[:inventory_id])
				# reactions = comments.map{ |comment| comment.usercontentreactions.map{ |ucr| }}
				data = []
				for comment in comments
					reaction = []
					for ucr in comment.usercontentreactions
						reaction.append(ucr.reaction.id)
					end
					data.append({comment: comment, reaction: reaction})
				end
				render json: {comments: data}
			end

			def comment_reaction
				comment = Comment.find(params[:comment_id])
				reactions = comment.usercontentreactions.map { |ucr| {id: ucr.reaction.id, emoji: ucr.reaction.emoji, user_id: ucr.user_id} }
				render json: {reactions: reactions}
			end

			def create_comments
				comment = Comment.new(user_id: params[:user_id], inventory_id: params[:inventory_id], comment: params[:content], username: params[:username])
				if comment.save
					render json: {success: 1, message: "comment saved successfully #{comment}"}, status: :ok
				else
					render json: {success: 0, message: "comment can't be saved"}
				end
			end

			def delete_comments
				comment = Comment.find(params[:comment_id])
				comment.destroy
				render json: {success: 1, message: 'Comment Deleted'}, status: :ok
			end
			
			def edit_comments
				comment = Comment.find(params[:comment_id])
				comment.update(comment: params[:content])
				if comment.save
					render json: {success:1 , message: "comment updated successfully"}
				else
					render json: {success: 0, message: "comment not updated"}
				end
			end
			
			# private

			# def comment_params
			# 	params.permit(:user_id, :inventory_id, :comment, :username, :content, :comment_id)
			# end
		end
	end
end

