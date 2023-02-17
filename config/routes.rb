Rails.application.routes.draw do
  mount RailsAdmin::Engine => '/adminpanel', as: 'rails_admin'

  post 'api/v1/users/search'

	namespace 'api' do
		namespace 'v1' do
			resources :inventories
			resources :users, only: [:show, :index]
			# resources :comments, only:[:show, :create]
			get '/user_content_reactions', to: "users#content_reaction"
			delete '/user_content_reactions', to: "users#delete_content_reaction"
			post '/user_content_reactions', to: "users#save_content_reaction"
			get '/comments', to: "comments#show_comments"
			delete '/comments', to: "comments#delete_comments"
			post '/comments/new', to: "comments#create_comments"
			put 'editComments', to: "comments#edit_comments"
			get 'reactions', to: "users#reactions"
		end
	end
end
