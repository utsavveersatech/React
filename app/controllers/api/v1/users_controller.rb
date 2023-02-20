module Api
	module V1
		class UsersController < ApplicationController
			
			def search
				user = User.find_by_username(params[:username])
				if(user)
					userroles = Userrole.where("user_id = ?", user.id).order(:role_id).limit(1)
					@role = Role.find_by_id(userroles[0].role_id)
				end

			   if (user && user.password == params[:password])
			      render json: {success: 1, manager: @role.name == 'Store Manager', userId: user.id}, status: :ok
			   else
			      render json: {success: 0, message: 'Username or password is incorrect'}, status: :ok
			   end
			end

			def index
				user = User.all
				render json: {users: user}
			end

			def show
				user1 = User.find(params[:id])
				render json: {user: user1}
			end

			def content_reaction
				inv=Inventory.find(params[:content_id])
				reactions = inv.usercontentreactions.map { |ucr| {id: ucr.reaction.id, emoji: ucr.reaction.emoji, user_id: ucr.user_id} }
				render json: {reactions: reactions}
			end

			def reactions
				rec = Reaction.all
				render json: {reactions: rec}
			end

			def save_content_reaction
				user_content_reaction = Usercontentreaction.new(user_id: params[:user_id], content_id: params[:content_id], reaction_id: params[:reaction_id], content_type: params[:content_type])
				if user_content_reaction.save
					render json: {success: 1, reaction: user_content_reaction}
				else
					render json: {success: 0, message: "some error occured"}
				end
			end

			def delete_content_reaction
				user = Usercontentreaction.where(["user_id = ? AND reaction_id = ? AND content_id = ? AND content_type = ?", params[:user_id], params[:reaction_id], params[:content_id], params[:content_type]])
				if Usercontentreaction.find_by(id: user.ids[0]).destroy
					render json: {success: 1, message: "reaction deleted successfully"}, status: :ok
				else
					render json: {success: 0, message: "reaction can't be deleted"}, status: :ok
				end
			end

		end
	end
end