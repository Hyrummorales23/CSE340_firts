-- Week 2 assignment Queries
-- Task 1
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'IamIronM@n'
    );
-- Task 2
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';
-- Task 3 
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';
-- Task 4
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'the small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- Task 5 
SELECT inv.inv_make,
    inv.inv_model,
    cl.classification_name
FROM public.inventory inv
    INNER JOIN public.classification cl ON inv.classification_id = cl.classification_id
WHERE cl.classification_name = 'Sport';
-- Task 6
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');