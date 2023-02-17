module Api
	module V1
		class CommentsController < ApplicationController

			def show_comments
				comments = Comment.where(inventory_id: params[:inventory_id])
				render json: {comments: comments}
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

