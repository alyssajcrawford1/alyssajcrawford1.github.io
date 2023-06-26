"""
"""

import pandas as pd, numpy as np, json, matplotlib.pyplot as plt, math, statsmodels.api as sm

class World_Cuisines:
    
    def __init__(self, filename):
        """
        """
        with open(filename, "r") as file:
            self.data = json.load(file)
        with open("ingredients_clean.json", "r") as file2:
            self.clean_ingredients = json.load(file2)
        with open("ingredients_categories.json", "r") as file3:
            self.ingredient_cats = json.load(file3)
        
        self.clean_data1, self.recipe_counts = self.make_clean_data1(self.data)
        self.clean_data1['totals'] = self.make_totals_data(self.clean_data1)
        self.top_ten1 = self.make_top_ten(self.clean_data1)
        
        self.clean_data2 = self.make_clean_data2(self.clean_data1)
        self.top_ten2 = self.make_top_ten(self.clean_data2)
        self.percents2 = self.make_percentages(self.top_ten2)
        
        self.category_data = self.make_category_data(self.clean_data2)
        self.top_ten3 = self.make_top_ten(self.category_data)
        self.percents3 = self.make_percentages(self.top_ten3)
    
    def make_clean_data1(self, data):
        """
        """
        clean_data = dict()
        recipe_counts = pd.Series(dtype=np.int64)
        for entry in data:
            cuisine = entry.get('cuisine')
            ingredients = entry.get('ingredients')
            if cuisine not in clean_data:
                ingredient_counts = pd.Series(data=1, index=ingredients, name=cuisine)
                clean_data[cuisine] = ingredient_counts
                recipe_counts[cuisine] = 1
            else:
                ingredient_counts = clean_data[cuisine]
                for ingredient in ingredients:
                    if ingredient in ingredient_counts:
                        ingredient_counts[ingredient] += 1  # increment frequency by 1
                    else:
                        ingredient_counts[ingredient] = 1  # add new ingredient w/ frequency 1
                recipe_counts[cuisine] += 1
        recipe_counts['Totals'] = recipe_counts.sum()
        print("clean_data1 complete")
        return clean_data, recipe_counts
    
    def make_totals_data(self, data):
        """
        """
        totals_data = pd.Series(dtype=np.int64)
        for cuisine in data:
            for ingredient in data[cuisine].index:
                if ingredient not in totals_data:
                    totals_data[ingredient] = data[cuisine][ingredient]
                else:
                    totals_data[ingredient] += data[cuisine][ingredient]
        print("totals_data complete")
        return totals_data
    
    def make_clean_data2(self, data):
        """
        """
        clean_data = self.copy_data(data)
        for cuisine in clean_data:
            for ingredient in clean_data[cuisine].index:
                for replace in self.clean_ingredients:
                    if ingredient in self.clean_ingredients[replace] and ingredient != replace:
                        if replace not in data[cuisine].index:
                            clean_data[cuisine][replace] = clean_data[cuisine][ingredient]
                        else:
                            clean_data[cuisine][replace] += clean_data[cuisine][ingredient]
                        clean_data[cuisine] = clean_data[cuisine].drop(ingredient)
                        break
            clean_data[cuisine] = clean_data[cuisine].drop("none")
            clean_data[cuisine] = clean_data[cuisine].nlargest(600)
        print("clean_data2 complete")
        return clean_data
    
    def make_category_data(self, data):
        """
        """
        cat_data = self.copy_data(data)
        for cuisine in cat_data:
            for ingredient in cat_data[cuisine].index:
                for category in self.ingredient_cats:
                    if ingredient in self.ingredient_cats[category] and ingredient != category:
                        if category not in cat_data[cuisine].index:
                            cat_data[cuisine][category] = cat_data[cuisine][ingredient]
                        else:
                            cat_data[cuisine][category] += cat_data[cuisine][ingredient]
                        cat_data[cuisine] = cat_data[cuisine].drop(ingredient)
                        break
        print("make_category_data complete")
        return cat_data
    
    def make_percentages(self, data):
        """
        """
        percents = self.copy_data(data)
        for cuisine in percents:
            recipes = self.recipe_counts[cuisine]
            percents[cuisine] = percents[cuisine]/recipes
            percents[cuisine] = percents[cuisine].drop('other')
        print("make_percentages complete")
        return percents
    
    def make_top_ten(self, data):
        """
        """
        top_tens = dict()
        for cuisine in data:
            if cuisine == 'totals':
                continue
            top_ten = data[cuisine].nlargest(n=10)
            top_ten['other'] = data[cuisine].sum()
            top_tens[cuisine] = top_ten
        print("make_top_ten complete")
        return top_tens
    
    def copy_data(self, data):
        """
        """
        copy = dict()
        for cuisine in data:
            copy[cuisine] = data[cuisine].copy(deep=True)
        return copy
    




    def make_top_ten_graphs(self):
        """ 
        """
        for cuisine in self.percents2:
            fig, ax = plt.subplots()
            bar = self.percents2[cuisine].plot.barh()
            if cuisine == 'totals':
                ax.set_title("Top 10 Ingredients Used in All Cooking Worldwide")
            else:
                ax.set_title("Top 10 Ingredients Used in "+cuisine.title()+" Cooking")
            ax.set_xlabel("Avg. # per Recipe")
            ax.set_ylabel("Ingredient")
            ax.set_xlim(0,1)
            plt.show()
    
    def make_top_ten_cat_graphs(self):
        """
        """
        for cuisine in self.percents2:
            fig, ax = plt.subplots()
            bar2 = self.percents3[cuisine].plot.barh()
            if cuisine == 'totals':
                ax.set_title("Top 10 Ingredient Categories Used in All Cooking Worldwide")
            else:
                ax.set_title("Top 10 Ingredient Categories Used in "+cuisine.title()+" Cooking")
            ax.set_xlabel("Avg. # per Recipe")
            ax.set_ylabel("Ingredient Category")
            plt.show()
        
    def make_full_cat_graph(self):
        """
        """
        total_cat_full = self.category_data['totals'].nlargest(28)
        total_percent_full = total_cat_full/self.recipe_counts['totals']

        fig, ax = plt.subplots()
        bar = total_percent_full.plot.barh(figsize=(8,9))
        ax.set_title("Use of Ingredient Categories Worldwide")
        ax.set_xlabel("Avg. # Used per Recipe")
        ax.set_ylabel("Ingredient Category")
        plt.show()
        
    def make_animal_products_graph(self):
        """
        """
        meats = pd.Series(dtype=np.int64)
        other_ps = pd.Series(dtype=np.int64)
        seafood = pd.Series(dtype=np.int64)
        animal_ps = pd.Series(dtype=np.int64)

        for cuisine in self.category_data:
            ctgs = self.category_data[cuisine]
            meat, other, fish = 0, 0, 0

            if 'seafood' in ctgs.index:
                fish += ctgs['seafood']
            if 'poultry' in ctgs.index:
                meat += ctgs['poultry']
            if 'red meat' in ctgs.index:
                meat += ctgs['red meat']
            if 'other processed dairy' in ctgs.index:
                other += ctgs['other processed dairy']
            if 'fresh dairy' in ctgs.index:
                other += ctgs['fresh dairy']
            if 'cheese' in ctgs.index:
                other += ctgs['cheese']
            if 'eggs' in ctgs.index:
                other += ctgs['eggs']
            
            meats[cuisine] = meat
            other_ps[cuisine] = other
            seafood[cuisine] = fish
            animal_ps[cuisine] = meat + other + fish
        
        animal_ps = animal_ps/self.recipe_counts
        animal_ps = animal_ps.drop('totals')
        animal_ps = animal_ps.drop('Totals')
        animal_ps = animal_ps.sort_values()

        other_ps = other_ps/self.recipe_counts
        other_ps = other_ps.drop('totals')
        other_ps = other_ps.drop('Totals')
        other_ps = other_ps.reindex(index=animal_ps.index)

        meats = meats/self.recipe_counts
        meats = meats.drop('totals')
        meats = meats.drop('Totals')
        meats = meats.reindex(index=animal_ps.index)

        seafood = seafood/self.recipe_counts
        seafood = seafood.drop('totals')
        seafood = seafood.drop('Totals')
        seafood = seafood.reindex(index=animal_ps.index)
        
        labels = list(meats.index)
        meat_list = list(meats.values)
        other_list = list(other_ps.values)
        fish_list = list(seafood.values)
        meatfish_list = list((seafood + meats).values)

        fig, ax = plt.subplots(figsize=(8,8))
        ax.barh(y=labels, width=meat_list, label='Meat')
        ax.barh(y=labels, width=fish_list, left=meat_list, label='Seafood')
        ax.barh(y=labels, width=other_list, left=meatfish_list, label='Other Animal Products')
        ax.set_title("Animal Product Consumption Across Cuisines")
        ax.set_xlabel("Avg. # per Recipe")
        ax.set_ylabel("Cuisine/Culture")
        ax.legend()
        plt.show()
        
    def get_ols_parameters(self, data):
        """
        Purpose: Given some Series dataset, fits a line to it and
        returns a list containing the slope, y-intercept, R^2 value,
        and p-value.
        Input:
            - data, a pandas Series of values
        Output:
            - a list containing the slope, y-int, R^2, and p-value
        """
        x = data.index.values
        X = sm.add_constant(x)
        model = sm.OLS(data, X)
        results = model.fit()
    
        slope = results.params['x1']
        y_int = results.params['const']
        r2 = results.rsquared
        p = results.pvalues['x1']
        return [slope, y_int, r2, p]
    
    def make_fat_acid_graph(self):
        """
        """
        fats = pd.Series(dtype=np.int64)
        acids = pd.Series(dtype=np.int64)
        
        for cuisine in self.category_data:
            fat, acid = 0, 0
            if 'fats' in self.category_data[cuisine].index:
                fat += self.category_data[cuisine]['fats']
            if 'fresh dairy' in self.category_data[cuisine].index:
                fat += self.category_data[cuisine]['fresh dairy']
            if 'other processed dairy' in self.category_data[cuisine].index:
                fat += self.category_data[cuisine]['other processed dairy']
            if 'cheese' in self.category_data[cuisine].index:
                fat += self.category_data[cuisine]['cheese']
            if 'vinegar' in self.category_data[cuisine].index:
                acid += self.category_data[cuisine]['vinegar']
            if 'alcohol' in self.category_data[cuisine].index:
                acid += self.category_data[cuisine]['alcohol']
            if 'fruit (sour)' in self.category_data[cuisine].index:
                acid += self.category_data[cuisine]['fruit (sour)']
            fats[cuisine] = fat
            acids[cuisine] = acid
        fats = fats.drop('totals')
        acids = acids.drop('totals')
        
        fats = fats/self.recipe_counts
        acids = acids/self.recipe_counts

        fats_v_acids = pd.Series(data=fats.values[1:], index=acids.values[1:])

        labels = list(fats.index)
        fat_list = list(fats.values)
        acid_list = list(acids.values)

        fig, ax = plt.subplots(figsize=(8,8))
        
        ax.scatter(x=fat_list, y=acid_list)
        x = fats.values
        params = self.get_ols_parameters(fats_v_acids)
        y = params[0] * x + params[1]
        plt.plot(x, y)
    
        for i, txt in enumerate(labels):
            ax.annotate("  "+txt, (fat_list[i], acid_list[i]))
    
        ax.set_title("Fats Vs. Acids Across Cuisines")
        ax.set_xlabel("Average # of Fats per Recipe")
        ax.set_ylabel("Average # of Acids per Recipe")
        ax.set_xticks([0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8])
        ax.set_xticks([0,0.2,0.4,0.6,0.8,1.0,1.2,1.4,1.6])
        plt.show()
        
    def make_sodium_graph(self):
        """
        """
        sodiums = pd.Series(dtype=np.int64)
        salt = pd.Series(dtype=np.int64)
        soy_sauce = pd.Series(dtype=np.int64)
        fish_sauce = pd.Series(dtype=np.int64)
        cheese = pd.Series(dtype=np.int64)
        
        for cuisine in self.clean_data2:
            salt[cuisine] = 0
            if 'salt' in self.clean_data2[cuisine].index:
                salt[cuisine] += self.clean_data2[cuisine]['salt']
            soy_sauce[cuisine] = 0
            if 'soy sauce' in self.clean_data2[cuisine].index:
                soy_sauce[cuisine] += self.clean_data2[cuisine]['soy sauce']
            fish_sauce[cuisine] = 0
            if 'fish sauce' in self.clean_data2[cuisine].index:
                fish_sauce[cuisine] += self.clean_data2[cuisine]['fish sauce']
            cheese[cuisine] = 0
            if 'cheese' in self.category_data[cuisine].index:
                cheese[cuisine] += self.category_data[cuisine]['cheese']
            sodiums[cuisine] = salt[cuisine]+soy_sauce[cuisine]+fish_sauce[cuisine]+cheese[cuisine]
            
        sodiums = sodiums.drop('totals')
        salt = salt.drop('totals')
        soy_sauce = soy_sauce.drop('totals')
        fish_sauce = fish_sauce.drop('totals')
        cheese = cheese.drop('totals')
        
        salt = salt/sodiums
        soy_sauce = soy_sauce/sodiums
        fish_sauce = fish_sauce/sodiums
        cheese = cheese/sodiums

        labels = list(salt.index)
        salt_list = list(salt.values)
        soy_list = list(soy_sauce.values)
        salt_and_soy = list((salt+soy_sauce).values)
        fish_list = list(fish_sauce.values)
        cheese_list = list(cheese.values)
        salt_soy_fish = list((salt+soy_sauce+fish_sauce).values)

        fig, ax = plt.subplots(figsize=(8,8))
        ax.barh(y=labels, width=salt_list, label='Salt')
        ax.barh(y=labels, width=soy_list, left=salt_list, label='Soy Sauce')
        ax.barh(y=labels, width=fish_list, left=salt_and_soy, label='Fish Sauce')
        ax.barh(y=labels, width=cheese_list, left=salt_soy_fish, label='Cheese')
        ax.set_title("Sodium Sources Across Cuisines")
        ax.set_xlabel("Proportion")
        ax.set_ylabel("Cuisine/Culture")
        ax.legend()
        plt.show()
