module Api
	module V1
		class InventoriesController < ApplicationController
			def index
				# approvedinventories = Inventory.where("status like 'Approved' and lastoperation not like 'Delete'")
				inventories = Inventory.all

				render json: {approvedinventories: inventories}
			end

			def create
				productname = inventory_params[:productname]
				duplicate = 1
				unless(Inventory.find_by_productname(productname))
					duplicate = 0
				end
				if(duplicate == 1)
					render json: {success: 0, message: 'Given Post Title is already present'}, status: :ok
				else
					inventory = Inventory.new(inventory_params)

					if(inventory.save)
						render json: {success: 1, message: 'Added Post'}, status: :ok
					else
						render json: {success: 0, message: 'Post not added'}, status: :ok
					end
				end
			end

			def update
				# inventory = Inventory.find(params[:id])

				# if (params[:lastoperation] == 'Delete')
				# 	if inventory.update_attributes(:lastoperation => 'Delete', :status => params[:status], :modifiedby => params[:modifiedby])
				# 		render json: {success: 1, message: 'Deleted Inventory'}, status: :ok
				# 	else
				# 		render json: {success: 0, message: 'Inventory not deleted', data: inventory.errors}, status: :ok
				# 	end
				# elsif (params[:lastoperation] == 'Edit')
				# 	if inventory.update_attributes(inventory_params)
				# 		render json: {success: 1, message: 'Updated Inventory'}, status: :ok
				# 	else
				# 		render json: {success: 0, message: 'Inventory not Updated', data: inventory.errors}, status: :ok
				# 	end
				# else
				# 	if inventory.update_attributes(inventory_params)
				# 		render json: {success: 1, message: 'Approved Inventory'}, status: :ok
				# 	else
				# 		render json: {success: 0, message: 'Inventory not Approved', data: inventory.errors}, status: :ok
				# 	end
				# end
				productname = inventory_params[:productname]
				duplicate = 1
				unless (Inventory.where("productname = ?", productname).count > 1)
					duplicate = 0
				end
				if(duplicate == 1)
					render json: {success: 0, message: 'Given Post Title is already present'}, status: :ok
				else
					inventory = Inventory.find(params[:id])

					if(inventory.update_attributes(inventory_params))
						render json: {success: 1, message: 'Modified Post'}, status: :ok
					else
						render json: {success: 0, message: 'Post not modified'}, status: :ok
					end
				end
			end

			def destroy
				inventory = Inventory.find(params[:id])
				if(inventory.destroy)
					render json: {success: 1, message: 'Deleted Post'}, status: :ok
				else
					render json: {success: 0, message: 'Post not deleted'}, status: :ok
				end
			end


			private

			def inventory_params
			   params.permit(:productname, :vendor)
			end
		end
	end
end