<template>
<div class="Menu">

	<b-link
		class="Menu__link App__title"
		:to="item.path"
		v-for="item in menuItems"
		:key="item.path"
		v-text="item.name"
		exact/>

</div>
</template>

<script>
/* Component to render a styled menu.

	Properties:
		- Items: An array of menu item obejcts:
		{ path: '/butts', name:'Click me' }

		- Auto: if set to true will automatically display
		from the routes.js file with the property `menu`
		set to `true`.

 */

import routes from '../router/routes';

export default {
	props: [
		'auto',
		'items'
	],
	data() {
		return {
			routes
		};
	},
	computed: {
		menuItems() {
			if (this.auto) {
				return this.routes.filter(route => route.menu);
			}
			return this.items;
		}
	}
};

</script>

<style lang="scss">
@import '../settings';

$colour: $Text-Colour;

.Menu{

	&__link{
		font-size: 16px;
		border-bottom: 1px solid $colour;
		padding-bottom: 0.2em;
		color: $colour !important;
		margin: 0 20px;
		display: inline-block;
		text-decoration: none !important;;
		transition: 50ms;

		@media all and (max-width: $Mobile-Width){
			font-size: 12px;
			margin: 5px 8px;
		}

	}

	.active, :hover{
		border-bottom: 3px solid $colour;
	}

	:active{
		position: relative;
		top: 2px;
	}
}
</style>
