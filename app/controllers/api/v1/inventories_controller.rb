module Api
	module V1
		class InventoriesController < ApplicationController
			def index
				approvedinventories = Inventory.where("status like 'Approved' and lastoperation not like 'Delete'")
				pendinginventories = Inventory.where("status like 'Pending'")

				render json: {approvedinventories: approvedinventories, pendinginventories: pendinginventories}
			end

			def create
				productid = inventory_params[:productid]
				duplicate = 1
				if(Inventory.find_by_productid(productid))
					latestinventory = Inventory.where("productid = ?", productid).order(:id).last
					if(latestinventory.status == 'Approved' && latestinventory.lastoperation == 'Delete')
						duplicate = 0
					end
				else
					duplicate = 0
				end
				if(duplicate == 1)
					render json: {success: 0, message: 'Given Product Id is already present'}, status: :ok
				else
					inventory = Inventory.new(inventory_params)

					if(inventory.save)
						render json: {success: 1, message: 'Added Inventory'}, status: :ok
					else
						render json: {success: 0, message: 'Inventory not added'}, status: :ok
					end
				end
			end

			def update
				inventory = Inventory.find(params[:id])
				if (params[:lastoperation] == 'Delete')
					if inventory.update_attributes(:lastoperation => 'Delete', :status => params[:status], :modifiedby => params[:modifiedby])
						render json: {success: 1, message: 'Deleted Inventory'}, status: :ok
					else
						render json: {success: 0, message: 'Inventory not deleted', data: inventory.errors}, status: :ok
					end
				elsif (params[:lastoperation] == 'Edit')
					if inventory.update_attributes(inventory_params)
						render json: {success: 1, message: 'Updated Inventory'}, status: :ok
					else
						render json: {success: 0, message: 'Inventory not Updated', data: inventory.errors}, status: :ok
					end
				else
					if inventory.update_attributes(inventory_params)
						render json: {success: 1, message: 'Approved Inventory'}, status: :ok
					else
						render json: {success: 0, message: 'Inventory not Approved', data: inventory.errors}, status: :ok
					end
				end
			end


			private

			def inventory_params
			   params.permit(:productid, :productname, :vendor, :mrp, :batchnum, :batchdate, :quantity, :status, :modifiedby, :lastoperation)
			end
		end
	end
end