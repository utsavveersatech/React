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
			      render json: {success: 1, manager: @role.name == 'Store Manager'}, status: :ok
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
		end
	end
end