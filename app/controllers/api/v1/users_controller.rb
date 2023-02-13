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
		end
	end
end